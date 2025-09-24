"use client";

import { useContext, useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router";

import { appAxios } from "@/http";
import { StoreProvider } from "./AppStoreProvider";

type AuthGuardProps = PropsWithChildren;

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { username, setState } = useContext(StoreProvider);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      // If we already have the user in store, skip request
      if (username) return;

      try {
        const res = await appAxios.get("/api/v1/auth/account", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { username, timezone, role } = res.data;

        setState((prev: any) => ({
          ...prev,
          username,
          timezone,
          role,
        }));
      } catch {
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    };

    verifyUser();
  }, [token, username, navigate, setState]);

  // Loading state: while we’re checking auth and no username is set yet
  if (token && !username) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
