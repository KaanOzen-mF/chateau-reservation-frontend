import { User } from "@/types/user";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

// Store state'inin durumunu tanımlayan interface
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

//Store actions'ını tanımlayan interface
interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

//Zustand store'unu oluşturma
export const useAuthStore = create<AuthState & AuthActions>()(
  // Store'un state'ini kalıcı hale getirmek (örn: Local Storage'a kaydetmek) için kullanılır.
  persist(
    // `set` fonksiyonu state'i güncellemek için kullanılır
    (set) => ({
      // --- Başlangıç State'i ---
      token: null,
      isAuthenticated: false,
      user: null,

      // --- Eylemler (Actions) ---
      setToken: (token) => {
        console.log("Setting token:", token ? "Token Present" : "Token Null"); // Debug log
        set({
          token: token,
          isAuthenticated: !!token, // Token varsa true, yoksa false yap
        });
      },

      setUser: (user) => {
        console.log("Setting user:", user); // Debug log
        set({ user: user });
        // İsteğe bağlı: Kullanıcı bilgisi gelince de isAuthenticated true yapılabilir
        // if (user) {
        //   set({ isAuthenticated: true });
        // }
      },

      // Basit login eylemi: Sadece token'ı ve isAuthenticated durumunu ayarlar.
      // Gerçek uygulamalarda bu action içinde API'dan kullanıcı bilgisi de çekilebilir.
      login: (token) => {
        console.log("AuthStore login action called.");
        set({ token: token, isAuthenticated: true, user: null }); // Kullanıcıyı başlangıçta null yapalım, ayrı fetch edilebilir
      },

      // Logout eylemi: Token, kullanıcı ve isAuthenticated durumunu sıfırlar.
      logout: () => {
        console.log("AuthStore logout action called.");
        set({ token: null, isAuthenticated: false, user: null });
        // persist middleware'i sayesinde token: null olunca Local Storage'dan da silinir.
      },
    }),
    // --- persist Middleware Ayarları ---
    {
      name: "auth-token-storage", // Local Storage'da kullanılacak anahtar (key) adı
      storage: createJSONStorage(() => localStorage), // Depolama alanı olarak Local Storage'ı kullan
      // Sadece 'token' alanını Local Storage'a kaydet, diğerlerini (user, isAuthenticated) kaydetme.
      // Bu sayede sayfa yenilendiğinde sadece token geri yüklenir.
      // isAuthenticated ve user bilgisi uygulamanın mantığına göre tekrar belirlenir.
      partialize: (state) => ({ token: state.token }),

      // (İsteğe bağlı) Storage'dan veri yüklendikten sonra çalışacak fonksiyon
      // Bu fonksiyon, sayfa yenilendiğinde Local Storage'dan token yüklenirse
      // isAuthenticated durumunu otomatik olarak true yapmak için kullanılabilir.
      //onRehydrateStorage: (state) => {
      // console.log("Hydration finished.");
      // Eğer rehidrasyon sonrası state'de token varsa, isAuthenticated'i true yap.
      // Ancak bu state'i doğrudan değiştiremez, bunun için bir action çağrılmalı
      // veya başlangıç state mantığı buna göre ayarlanmalı.
      // Şimdilik en basit yol, bileşenlerde token varlığını kontrol etmek.
      // Veya:
      // return (state, error) => {
      //   if (state?.token) {
      //     state.isAuthenticated = true; // Bu şekilde doğrudan state'i değiştirmek tavsiye edilmez
      //   }
      // }
      // Şimdilik bu fonksiyonu boş bırakabilir veya kaldırabiliriz.
    }
    //  }
  )
);

// (İsteğe bağlı) Başlangıçta token varsa isAuthenticated'i ayarlamak için ek mantık
// Sayfa ilk yüklendiğinde (client-side) Local Storage'daki token'a bakıp
// state'i senkronize etmek isteyebiliriz. `persist` middleware'i token'ı yükler,
// ama isAuthenticated'i biz ayarlamalıyız.
// Bu kontrol genellikle _app.tsx veya ana layout'ta bir useEffect içinde yapılır.
// Şimdilik layout içinde yapacağız.

// Store'un başlangıç state'ini manuel olarak senkronize etmek için bir yol (opsiyonel):
// function initializeAuth() {
//   const initialToken = useAuthStore.getState().token;
//   if (initialToken) {
//     useAuthStore.setState({ isAuthenticated: true });
//   }
// }
// initializeAuth(); // Bu, kodun nerede çalıştığına bağlı olarak sorun çıkarabilir (client vs server)
