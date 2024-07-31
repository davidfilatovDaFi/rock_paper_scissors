import { useContext, useEffect, useState } from "react";
import { IPlayer, SocketContext } from "../App";
import { Hand, whoWin } from "../util/helpers";

const Game = () => {
  const { room, socket } = useContext(SocketContext);

  const [players, setPlayers] = useState<IPlayer[] | null>();
  const [option, setOption] = useState("");

  useEffect(() => {
    if (room?.players) {
      room.players.sort((player1) => (player1.id === socket.id ? -1 : 1));
      setPlayers([...room.players]);
    }
  }, [room]);

  useEffect(() => {
    if (option) {
      if (room?.players.some((player) => player.optionLock === true)) {
        setTimeout(() => {
          room.players[0].option = option;
          room.players[0].optionLock = true;
          socket.emit("room:update", room);
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

  return (
    <div>
      {players && (
        <div>
          {players[0].id} {players[0].score}
        </div>
      )}
      {players && players[1] && (
        <div>
          {players[1].id} {players[1].score}
        </div>
      )}
      {room?.players && (
        <div>
          {["rock", "paper", "scissors"].map((hand) => (
            <button
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
      <div>
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
      </div>
    </div>
  );
};

export default Game;
