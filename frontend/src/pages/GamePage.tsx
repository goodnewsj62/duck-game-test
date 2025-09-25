import ActiveGame from "@/components/ActiveGame";
import { StoreProvider } from "@/components/AppStoreProvider";
import CoolDownZombie from "@/components/CoolDownZombie";
import FinalScore from "@/components/FinalScore";
import ZombieTap from "@/components/ZombieTap";
import { useTap } from "@/hooks/useTapHook";
import { appAxios } from "@/http";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { addSeconds, parseISO } from "date-fns";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router";

const GamePage = () => {
  const { id } = useParams();
  const { username } = useContext(StoreProvider);
  const { data, status } = useQuery({
    queryKey: ["query", id],
    queryFn: async (): Promise<RoundResp> => {
      return (
        await appAxios.get(`/api/v1/rounds/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
      ).data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => {
                window.history.back();
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft size={20} />
              <span className="text-lg font-bold uppercase tracking-wider">
                Cooldown
              </span>
            </button>
            <div className="text-lg font-medium text-gray-600">{username}</div>
          </div>
        </div>

        {status === "pending" && (
          <div className="min-h-16  w-full flex flex-col items-center justify-center gap-6">
            <CircularProgress />
            <div>Loading data please wait...</div>
          </div>
        )}
        {status === "error" && (
          <div className="min-h-16  w-full flex flex-col items-center justify-center gap-6">
            <h3>An Error Occurred</h3>
            <p>please refresh and try again</p>
          </div>
        )}

        {status === "success" && <GapeCompWrapper round={data} />}
      </div>
    </div>
  );
};

export default GamePage;

function GapeCompWrapper({ round }: { round: RoundResp }) {
  const [firstMoment] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const { getScore, score, sendTap, roundStat } = useTap(
    localStorage.getItem("access_token") || ""
  );

  const skewStart = useMemo(
    () => addSeconds(parseISO(round.startDate), round.coolingDuration),
    [round.startDate, round.coolingDuration]
  );

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  const showCooling = currentTime <= skewStart;
  const showInteractive =
    currentTime >= skewStart && currentTime <= new Date(round.endDate);
  const showScore = currentTime >= new Date(round.endDate);

  const secondsToGameEnd =
    (new Date(round.endDate).getTime() - currentTime.getTime()) / 1000;

  const secondsToGameStart =
    (skewStart.getTime() - currentTime.getTime()) / 1000;
  const isCooling =
    currentTime > new Date(round.startDate) && currentTime < skewStart;
  const totalTimeReference =
    (skewStart.getTime() - firstMoment.getTime()) / 1000;

  useEffect(() => {
    if (showScore) {
      const t_id = setTimeout(() => getScore(round.id), 1000);
      return () => clearTimeout(t_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScore]);

  return (
    <>
      {showCooling && (
        <CoolDownZombie
          timeUntilStart={secondsToGameStart}
          totalTime={totalTimeReference}
          isCooling={isCooling}
        >
          <ZombieTap onClick={() => {}} />
        </CoolDownZombie>
      )}
      {showInteractive && (
        <ActiveGame points={score ?? 0} timeLeft={secondsToGameEnd}>
          <ZombieTap
            onClick={() => {
              sendTap(round.id);
            }}
          />
        </ActiveGame>
      )}
      {showScore && (
        <FinalScore
          myPoints={roundStat?.score ?? 0}
          topPoint={roundStat?.higestest ?? 0}
          totalPoint={roundStat?.totalScore ?? 0}
          username={roundStat?.username ?? "uknown"}
        >
          <ZombieTap onClick={() => {}} />
        </FinalScore>
      )}
    </>
  );
}
