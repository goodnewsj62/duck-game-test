import { formatTime } from "@/utils";
import type { PropsWithChildren } from "react";
import { FaRegClock } from "react-icons/fa";

type CoolDownZombieProps = {
  totalTime: number;
  timeUntilStart: number;
  isCooling?: boolean;
} & PropsWithChildren;

const CoolDownZombie: React.FC<CoolDownZombieProps> = ({
  children,
  timeUntilStart,
  totalTime,
  isCooling,
}) => {
  return (
    <>
      {" "}
      {/* Game Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        {/* Circle Pattern (dimmed) */}
        {/* <div className="pointer-events-none opacity-70"> */}
        <div className="pointer-events-none opacity-40">{children}</div>

        {/* Status and Info */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
            <FaRegClock size={24} />
            {isCooling ? "Cooldown" : "Pending"}
          </div>

          <div className="text-lg font-semibold text-gray-800">
            Time until round starts:
            <div className="text-blue-600 font-mono text-xl mt-1">
              {formatTime(timeUntilStart)}
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500 mb-2">
            Get ready for the next round!
          </div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            <FaRegClock size={16} />
            Waiting period active
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-sm text-gray-600 mb-2">Round starting in:</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((totalTime - timeUntilStart) / totalTime) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      {/* Instructions */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="text-sm text-orange-800">
          <strong>{isCooling ? "Cooldown" : "Pending"} period:</strong> Please
          wait for the next round to begin. Use this time to prepare!
        </div>
      </div>
    </>
  );
};

export default CoolDownZombie;
