"use client";

import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}