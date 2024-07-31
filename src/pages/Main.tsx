import { useContext } from "react";
import { SocketContext } from "../App";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          socket.emit("room:create", (roomId: string) => {
            navigate(`/game/${roomId}`);
          });
        }}
      >
        start
      </button>
    </div>
  );
};

export default Main;
