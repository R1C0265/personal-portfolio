// src/hooks/useAuth.ts
"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export function useAuth() {
  const { setUser, setLoading } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn:  async () => (await api.get("/auth/me")).data.user,
    retry:    false,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    setLoading(isLoading);
    if (!isLoading) setUser(data ?? null);
  }, [data, isLoading, setUser, setLoading]);
}
