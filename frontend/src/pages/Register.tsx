import GameWelcomeText from "@/components/GameWelcomeText";
import { appAxios } from "@/http";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await appAxios.post("/api/v1/auth/register", {
        username,
        password,
        timezone,
      });

      // 🎯 after registration, redirect to login instead of logging in directly
      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful! Please log in.");
        navigate("/login", { replace: true });
      } else {
        toast.error("Registration failed: Invalid response from server");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed: Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-900 flex flex-col gap-6 items-center justify-center p-4">
      <GameWelcomeText />
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <Typography
            variant="h4"
            component="h1"
            className="text-center mb-8 font-bold text-gray-800"
          >
            Register
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
              onClick={handleRegister}
              disabled={loading}
              className="mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              {loading ? "Creating Please wait..." : "Register"}
            </Button>
          </div>

          <div className="py-2">
            Already have an account?{" "}
            <span className="text-blue-600 font-medium">
              <Link to={"/login"}>Login</Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
