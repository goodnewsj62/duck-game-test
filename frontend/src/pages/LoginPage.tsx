"use client";

import { StoreProvider } from "@/components/AppStoreProvider";
import GameWelcomeText from "@/components/GameWelcomeText";
import { appAxios } from "@/http";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const { setState } = useContext(StoreProvider);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await appAxios.post("/api/v1/auth/login", {
        username,
        password,
      });

      const { access_token, user } = response.data;

      if (access_token) {
        setState((prev: any) => ({
          ...prev,
          role: user.role,
          timezone: user.timezone,
          username: user.username,
        }));

        localStorage.setItem("access_token", access_token);
        toast.success("Login successful!");
        setTimeout(
          () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          20
        );
        navigate("/", { replace: true });
      } else {
        toast.error("Login failed:  Invaid response from server");
      }
    } catch {
      toast.error("Login failed: Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-900 flex gap-6 flex-col items-center justify-center p-4">
      <GameWelcomeText />
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <Typography
            variant="h4"
            component="h1"
            className="text-center mb-8 font-bold text-gray-800"
          >
            LOGIN
          </Typography>

          <div className="space-y-6">
            <div>
              <Typography variant="body1" className="mb-2 text-gray-700">
                Username:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Typography variant="body1" className="mb-2 text-gray-700">
                Password:
              </Typography>
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </div>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              className="mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>

          <div className="py-2">
            Do not have an account?{" "}
            <span className="text-blue-600 font-medium">
              <Link to={"/register"}> register</Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
