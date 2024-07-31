import { useContext, useEffect, useState } from "react";
import { IPlayer, SocketContext } from "../App";
import { Hand, whoWin } from "../util/helpers";
import rockImg from "../assets/rock.png";
import paperImg from "../assets/paper.png";
import scissorsImg from "../assets/scissors.png";

const handImages = {
  rock: rockImg,
  paper: paperImg,
  scissors: scissorsImg,
};

const Game = () => {
  const { room, socket } = useContext(SocketContext);

  const [players, setPlayers] = useState<IPlayer[] | null>();
  const [option, setOption] = useState("");
  const [isAnim, setIsAnim] = useState(false);

  useEffect(() => {
    if (room?.players) {
      room.players.sort((player1) => (player1.id === socket.id ? -1 : 1));
      setPlayers([...room.players]);
    }
  }, [room]);

  useEffect(() => {
    if (option) {
      if (room?.players.some((player) => player.optionLock === true)) {
        setIsAnim(true);
        setTimeout(() => {
          room.players[0].option = option;
          room.players[0].optionLock = true;
          socket.emit("room:update", room);
          setIsAnim(false);
          setTimeout(() => {
            const result: "win" | "draw" | "lose" = whoWin(
              option as Hand,
              room.players[1].option as Hand
            );
            if (result === "win") room.players[0].score++;
            if (result === "lose") room.players[1].score++;
            socket.emit("room:update", room);
          }, 0);
          setTimeout(() => {
            room.players[0].option = null;
            room.players[1].option = null;
            room.players[0].optionLock = false;
            room.players[1].optionLock = false;
            socket.emit("room:update", room);
          }, 3000);
        }, 2000);
      } else {
        setTimeout(() => {
          if (room) {
            room.players[0].optionLock = true;
            room.players[0].option = option;
            socket.emit("room:update", room);
          }
        }, 0);
      }
      setOption("");
    }
    console.log(room, option);
  }, [option]);

  if (!room) return <h2>Загрузка</h2>;

  return (
    <div className="w-full h-full relative flex items-center justify-center gap-10">
      {/* {players && (
        <div>
          {players[0].id} {players[0].score}
        </div>
      )}
      {players && players[1] && (
        <div>
          {players[1].id} {players[1].score}
        </div>
      )} */}
      {players && players[1] && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 flex items-center gap-10 text-[32px] font-bold">
          <h2>{players[0].score}</h2>
          <h2>{players[1].score}</h2>
        </div>
      )}
      {room?.players && (
        <div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex items-center gap-2">
          {["rock", "paper", "scissors"].map((hand) => (
            <button
              className="bg-[#45eaff] border-[2px] border-[#fd30d5] rounded-2xl flex items-center justify-center w-[100px] h-[50px] text-[22px] font-bold"
              key={hand}
              onClick={() => {
                if (!room.players[0].optionLock) {
                  setOption(hand);
                  setTimeout(() => {
                    socket.emit("room:update", room);
                  }, 0);
                }
              }}
            >
              {hand}
            </button>
          ))}
        </div>
      )}
      <img
        className={`w-[200px] h-[300px] ${isAnim && "animHand"}`}
        src={
          handImages[
            room.players.every((player) => player.optionLock)
              ? (room?.players[0].option as Hand)
              : "rock"
          ]
        }
        alt=""
      />
      {room?.players.length === 2 ? (
        <img
          className={`w-[200px] h-[300px] ${isAnim && "animHand"}`}
          src={
            handImages[
              room?.players[1].option &&
              room.players.every((player) => player.optionLock)
                ? (room?.players[1].option as Hand)
                : "rock"
            ]
          }
          alt=""
        />
      ) : (
        <div className="w-[200px] h-[300px] text-[32px] text-center font-bold flex items-center justify-center border-[2px] border-black rounded-xl">
          Ждем вашего соперника
        </div>
      )}
      {/* <div>
        <div>
          ты{" "}
          {room?.players[0].option &&
          room.players.every((player) => player.optionLock)
            ? room?.players[0].option
            : "rock"}
        </div>
        <div>
          он{" "}
          {room?.players.length === 2
            ? room?.players[1].option &&
              room.players.every((player) => player.optionLock)
              ? room?.players[1].option
              : "rock"
            : ""}
        </div>
      </div> */}
    </div>
  );
};

export default Game;
