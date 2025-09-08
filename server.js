// server.js (ESM, 상태 캐싱 + 최소 로그 + 로컬 IP 표시)
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import os from "os";

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.static("."));

let lastState = null; // ★ 마지막 상태 캐시 (카메라/스케일 등)

// 로컬 IPv4 주소 수집
function getLocalIPv4List() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Node v18+: net.family === 4 일 수도 있고, 문자열 'IPv4' 일 수도 있음
      const family = typeof net.family === "string" ? net.family : (net.family === 4 ? "IPv4" : `${net.family}`);
      if (family === "IPv4" && !net.internal) {
        results.push({ iface: name, address: net.address });
      }
    }
  }
  return results;
}

httpServer.listen(PORT, () => {
  const local = `http://localhost:${PORT}`;
  console.log(`✔ 서버 실행중 → ${local}`);

  // 같은 네트워크의 다른 기기에서 접속 가능한 주소들 출력
  const ips = getLocalIPv4List();
  if (ips.length) {
    console.log("ℹ 같은 Wi-Fi/유선 네트워크의 다른 기기에서 접속:");
    ips.forEach(({ iface, address }) => {
      console.log(`   - ${iface}: http://${address}:${PORT}`);
    });
  } else {
    console.log("ℹ 로컬 IPv4를 찾을 수 없습니다. (VM/WSL/도커 환경이거나 네트워크가 비활성화일 수 있습니다)");
    console.log("  다른 기기 접속 예: http://<PC-IP>:" + PORT);
  }
});

io.on("connection", (socket) => {
  console.log(`+ 연결: ${socket.id} | 현재 ${io.engine.clientsCount}명`);

  // ★ 새로 접속한 클라이언트에 마지막 상태 즉시 전송
  if (lastState) {
    socket.emit("syncState", lastState);
  }

  // 통신 내용은 로깅하지 않고, 이벤트 중계만
  socket.onAny((event, ...args) => {
    // 상태 이벤트면 캐시를 갱신(얕은 병합)
    if (event === "syncState" && args[0] && typeof args[0] === "object") {
      lastState = { ...(lastState || {}), ...args[0] };
    }
    socket.broadcast.emit(event, ...args);
  });

  socket.on("disconnect", (reason) => {
    console.log(`- 해제: ${socket.id} | 이유: ${reason} | 현재 ${io.engine.clientsCount}명`);
  });

  socket.on("error", (err) => {
    console.log(`✖ 소켓 오류: ${socket.id} | ${String(err)}`);
  });
});
