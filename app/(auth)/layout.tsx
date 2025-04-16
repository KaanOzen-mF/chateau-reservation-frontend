// src/app/(auth)/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && token) {
      console.log("AuthLayout: Token found post-hydration. Redirecting...");
      router.replace("/");
    }
  }, [token, isHydrated, router]);

  // Henüz hydrate olmadıysa VEYA hydrate oldu ve token varsa (yani yönlendirme olacaksa)
  // yükleniyor göstergesini göster.
  if (!isHydrated || token) {
    return (
      // Yükleniyor ikonunu ortala
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />{" "}
        {/* Boyut, renk (primary temadan) ve animasyon */}
      </div>
    );
  }

  // Eğer hydrate olduysa VE token yoksa (kullanıcı giriş yapmamışsa),
  // asıl auth sayfasını (sign-in veya sign-up) göster.
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-transparent dark:bg-gray-900">
      {children}
      <Toaster richColors position="bottom-center" closeButton />
    </main>
  );
}
