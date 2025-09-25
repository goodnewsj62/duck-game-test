import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useTap(token: string) {
  const [score, setScore] = useState<number | null>(null);
  const [roundStat, setRoundStat] = useState<RoundStat | undefined>(undefined);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) {
      toast.error("You are unatenticated");
      return;
    }

    // Securely pass token as query param
    const socket = new WebSocket(`${import.meta.env.VITE_APP_WEB_SOCKET_URL}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to game server");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Incoming:", message);

      switch (message.event) {
        case "score-updated":
          setScore(message.data.score);
          break;
        case "round-score":
          setRoundStat(message.data.score);
          break;
        case "error":
          toast.error(message.data.message);
          break;
      }
    };

    socket.onclose = () => {
      console.log("❌ Disconnected");
    };

    return () => {
      socket.close();
    };
  }, [token]);

  // send tap event
  const sendTap = (roundId: string) => {
    socketRef.current?.send(
      JSON.stringify({
        event: "tap",
        data: { roundId, token },
      })
    );
  };

  // request score
  const getScore = (roundId: string) => {
    socketRef.current?.send(
      JSON.stringify({
        event: "get-score",
        data: { roundId, token },
      })
    );
  };

  return { score, sendTap, getScore, roundStat };
}
