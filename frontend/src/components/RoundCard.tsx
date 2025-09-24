import { addMinutes, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function RoundCard({ round }: { round: RoundResp }) {
  const [status, setStatus] = useState(() =>
    getStatus(round.startDate, round.endDate, round.coolingDuration)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(
        getStatus(round.startDate, round.endDate, round.coolingDuration)
      );
    }, 30 * 1000); // 🔁 recalc status every 30s

    return () => clearInterval(interval);
  }, [round.startDate, round.endDate, round.coolingDuration]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <Link to={`/play/${round.id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="text-sm text-gray-600 font-mono">
              Round ID: <span className="text-gray-800">{round.id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600">Start:</div>
            <div className="font-medium text-gray-800">
              {format(parseISO(round.startDate), "MMM, dd yyyy h:mma")}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">End:</div>
            <div className="font-medium text-gray-800">
              {format(parseISO(round.endDate), "MMM, dd yyyy h:mma")}
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Status:</div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
          >
            {status.status}
          </span>
        </div>
      </Link>
    </div>
  );
}

function getStatus(startAt: string, endAt: string, cooling: number) {
  const now = new Date();
  if (now > new Date(endAt))
    return { color: "text-red-500 bg-red-100", status: "expired" };

  if (now < new Date(startAt))
    return { color: "text-orange-500 bg-orange-100", status: "pending" };
  if (now > new Date(startAt) && now < addMinutes(parseISO(startAt), cooling))
    return { color: "text-yellow-600 bg-yellow-100", status: "Cooldown" };
  return { color: "text-green-600 bg-green-100", status: "active" };
}
