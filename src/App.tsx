import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Main from "./pages/Main";
import Game from "./pages/Game";

export interface IPlayer {
  id: string;
  option: null | string;
  optionLock: boolean;
  score: number;
}

interface ISocketData {
  socket: Socket;
  room: {
    id: string;
    vacant: boolean;
    players: IPlayer[];
  } | null;
}

const URL = "https://rock-paper-scissors-backend-2bjg.onrender.com";
const socket = io(URL);
socket.connect();

export const SocketContext = createContext<ISocketData>({
  socket,
  room: null,
});

function App() {
  const [socketData, setSocketData] = useState<ISocketData>({
    socket,
    room: null,
  });

  useEffect(() => {
    socket.on("room:get", (room) => {
      setSocketData((socketData) => ({ ...socketData!, room }));
    });
  }, []);

  return (
    <SocketContext.Provider value={socketData as ISocketData}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route path="game/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
