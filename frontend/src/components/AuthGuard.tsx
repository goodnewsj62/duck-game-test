"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, type PropsWithChildren } from "react";

import { useNavigate } from "react-router";
import { StoreProvider } from "./AppStoreProvider";

type AuthGuardProps = PropsWithChildren;

const fetchUser = async (token: string) => {
  const res = await axios.get("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userName, setState } = useContext(StoreProvider);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Fetch user if not in store but token exists
  const { data, error, isFetching } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => fetchUser(token!),
    enabled: !userName && !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setState((prev: any) => ({
        ...prev,
        userName: data.name,
        timezone: data.timezone,
      }));
    }
  }, [data, setState]);

  useEffect(() => {
    if (error && axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login", { replace: true });
      }
    }
  }, [error, navigate]);

  if (isFetching) return <div>Loading...</div>;

  return <>{children}</>;
};

export default AuthGuard;
