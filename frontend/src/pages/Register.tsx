import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const RegisterPage = () => {
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

      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem("access_token", access_token);
        toast.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        toast.error("Login failed: Invalid response from server");
      }
    } catch {
      toast.error("Login failed: Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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
              {loading ? "Creating Please wait..." : "Register"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
