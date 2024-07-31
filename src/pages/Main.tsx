import { useContext } from "react";
import { SocketContext } from "../App";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";

const Main = () => {
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <img className="w-[1000px] h-[750px] object-contain" src={bg} alt="" />
      <button
        className="bg-[#45eaff] border-[2px] border-[#fd30d5] rounded-2xl px-10 py-4 text-[22px] font-bold"
        onClick={() => {
          socket.emit("room:create", (roomId: string) => {
            navigate(`/game/${roomId}`);
          });
        }}
      >
        Найти игру
      </button>
    </div>
  );
};

export default Main;
