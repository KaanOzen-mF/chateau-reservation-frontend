// src/app/(auth)/layout.tsx
import React from "react";
import { Toaster } from "@/components/ui/sonner";
//auth grubundaki tüm sayfaları (sign-in, sign-up) saracak.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-transparent dark:bg-gray-900">
      {children}
      <Toaster richColors position="bottom-center" closeButton />
    </main>
  );
}
