import image from "@/assets/Zombie-Duck-no-bg.svg";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaRegClock } from "react-icons/fa";

const GamePage = () => {
  const [timeUntilStart, setTimeUntilStart] = useState(15); // seconds
  const playerName = "Player Name";

  // Countdown timer
  useEffect(() => {
    if (timeUntilStart > 0) {
      const timer = setTimeout(
        () => setTimeUntilStart(timeUntilStart - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [timeUntilStart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleBack = () => {
    console.log("Navigate back to rounds list");
  };

  // Create the circle pattern using ASCII-like blocks (same as active round)
  const CirclePattern = () => (
    <div className="font-mono  relative text-xs leading-none select-none mb-8  cursor-pointer">
      <img src={image} alt="duck" />
      <button
        type="button"
        className="text-2xl text-white font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[rgba(0,0,0,0.4)] rounded-2xl"
      >
        Tap
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft size={20} />
              <span className="text-lg font-bold uppercase tracking-wider">
                Cooldown
              </span>
            </button>
            <div className="text-lg font-medium text-gray-600">
              {playerName}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Circle Pattern (dimmed) */}
          {/* <div className="pointer-events-none opacity-70"> */}
          <div className="">
            <CirclePattern />
          </div>

          {/* Status and Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
              <FaRegClock size={24} />
              Cooldown
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
              style={{ width: `${((15 - timeUntilStart) / 15) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-800">
            <strong>Cooldown period:</strong> Please wait for the next round to
            begin. Use this time to prepare!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
