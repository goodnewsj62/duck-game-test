import { StoreProvider } from "@/components/AppStoreProvider";
import CreateRound from "@/components/CreateRoundModal";
import RoundCard from "@/components/RoundCard";
import { appAxios } from "@/http";
import { Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";

const RoundsListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { username, role, setState } = useContext(StoreProvider);

  const isAdmin = role === "ADMIN";

  const { data, status } = useQuery({
    queryKey: ["rounds", isAdmin, username],
    queryFn: async (): Promise<RoundResp[]> => {
      const url = isAdmin ? "/api/v1/rounds" : "/api/v1/rounds/valid";
      return (
        await appAxios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
      ).data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setState(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className=" font-bold text-gray-800 uppercase tracking-wider md:text-2xl">
              ROUNDS LIST
            </h1>
            <div className=" font-bold text-gray-600 capitalize">
              Welcome {username}
            </div>
          </div>

          {/* Create Round Button - Only visible for admin */}
          <div className="flex flex-col  md:items-center  md:justify-between md:flex-row">
            {isAdmin && (
              <div className="p-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <FaPlus size={20} />
                  Create Round
                </button>
              </div>
            )}

            <div className=" py-2 px-4 md:ml-auto">
              <Button
                color="error"
                disableElevation
                variant="contained"
                className="!capitalize font-bold"
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Rounds List */}
        {status === "success" && (
          <div className="space-y-4">
            {data.map((round) => (
              <RoundCard key={round.id} round={round} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {status === "success" && data.length < 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">
              No rounds available
            </div>
            <div className="text-gray-500 text-sm">
              Check back later for new rounds
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">
              oops! an error occurred
            </div>
            <div className="text-gray-500 text-sm">Reach out to support</div>
          </div>
        )}

        {status === "pending" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-full gap-4  h-full flex-col flex items-center justify-center">
              <CircularProgress />
              <div className="">loading please wait...</div>
            </div>
          </div>
        )}
      </div>

      {isOpen && <CreateRound onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default RoundsListPage;
