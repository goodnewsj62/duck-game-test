import { FaPlus } from "react-icons/fa";

const RoundsListPage = () => {
  const playerName = "Player Name";
  const isAdmin = true; // Change this based on user role

  const rounds = [
    {
      id: "8c3eed83-8a8a-41a0-8f91-9ad501e8f8a1",
      start: "18.05.2025, 06:28:17",
      end: "18.05.2025, 06:29:17",
      status: "Active",
      statusColor: "text-green-600 bg-green-100",
    },
    {
      id: "8c3eed83-8a8a-41a0-8f91-9ad501e8f8a2",
      start: "18.05.2025, 07:28:17",
      end: "18.05.2025, 08:29:17",
      status: "Cooldown",
      statusColor: "text-yellow-600 bg-yellow-100",
    },
  ];

  const handleRoundClick = (roundId: any) => {
    console.log("Navigate to round:", roundId);
  };

  const handleCreateRound = () => {
    console.log("Create new round");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
              ROUNDS LIST
            </h1>
            <div className="text-lg font-medium text-gray-600">
              {playerName}
            </div>
          </div>

          {/* Create Round Button - Only visible for admin */}
          {isAdmin && (
            <div className="p-6">
              <button
                onClick={handleCreateRound}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <FaPlus size={20} />
                Create Round
              </button>
            </div>
          )}
        </div>

        {/* Rounds List */}
        <div className="space-y-4">
          {rounds.map((round) => (
            <div
              key={round.id}
              onClick={() => handleRoundClick(round.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
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
                  <div className="font-medium text-gray-800">{round.start}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">End:</div>
                  <div className="font-medium text-gray-800">{round.end}</div>
                </div>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Status:</div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${round.statusColor}`}
                >
                  {round.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rounds.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">
              No rounds available
            </div>
            <div className="text-gray-500 text-sm">
              Check back later for new rounds
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundsListPage;
