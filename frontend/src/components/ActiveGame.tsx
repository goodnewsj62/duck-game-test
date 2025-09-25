import { formatTime } from "@/utils";
import type { PropsWithChildren } from "react";

type ActiveGameProps = {
  timeLeft: number;
  points: number;
} & PropsWithChildren;
const ActiveGame: React.FC<ActiveGameProps> = ({
  children,
  points,
  timeLeft,
}) => {
  return (
    <div className="max-w-md mx-auto">
      {/* Header */}

      {/* Game Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        {/* Circle Pattern */}
        <div className="cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors active:bg-gray-100">
          {children}
        </div>

        {/* Status and Info */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-600">Round Active!</div>

          <div className="text-lg font-semibold text-gray-800">
            Time left:{" "}
            <span className="text-red-600 font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="text-lg font-semibold text-blue-600">
            My Points: <span className="font-mono">{points}</span>
          </div>
        </div>

        {/* Tap hint */}
        <div className="mt-6 text-sm text-gray-500">
          Tap the duck to score points!
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <strong>How to play:</strong> Tap the duck as fast as you can to earn
          points before time runs out!
        </div>
      </div>
    </div>
  );
};

export default ActiveGame;
