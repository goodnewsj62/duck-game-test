import type { PropsWithChildren } from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";
import { GiStarsStack } from "react-icons/gi";
import { IoMdTrendingUp } from "react-icons/io";

type FinalScoreProps = {
  totalPoint: number;
  username: string;
  topPoint: number;
  myPoints: number;
} & PropsWithChildren;
const FinalScore: React.FC<FinalScoreProps> = ({
  children,
  myPoints,
  topPoint,
  totalPoint,
  username,
}) => {
  return (
    <div className="max-w-md mx-auto">
      {/* Header */}

      {/* Game Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        {/* Circle Pattern (dimmed) */}
        <div className="pointer-events-none opacity-50">{children}</div>

        {/* Completion Status */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2 mb-2">
            <FaTrophy size={24} />
            Round Complete!
          </div>
          <div className="text-sm text-gray-500">
            Great job! Here are the final results:
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            {/* Total Points */}
            <div className="flex flex-col gap-2 py-2">
              <div className="flex items-center gap-2 text-gray-600">
                <IoMdTrendingUp className="text-green-500" size={16} />
                <span className="font-medium">Total Points</span>

                <div className="ml-auto">{totalPoint}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaMedal className="text-orange-400" size={16} />
                <span className="font-medium">Winner</span>
                <div className="ml-auto">
                  {username} {topPoint}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GiStarsStack className="text-orange-400" size={16} />
                <span className="font-medium">My Points</span>
                <div className="ml-auto">{myPoints}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;
