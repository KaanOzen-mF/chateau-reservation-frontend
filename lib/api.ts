import { ZodSchema, ZodError } from "zod";

//API'den dönecek olan hatalar için bir interface
interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

interface RequestOptions<T> extends RequestInit {
  token?: string | null; // JWT tokeni auth için
  responseSchema?: ZodSchema<T>; // API'den dönecek olan verinin şeması
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions<T> = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Base URL is not defined in environment variables.");
  }

  const url = `${baseUrl}${endpoint}`;

  // Varsayılan headers ve gönderilen başlıkları birleştiriyoruz
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>), // diğer headers varsıyalanları ezer
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`; // JWT tokeni auth için
  }

  try {
    const response = await fetch(url, {
      ...options, // method, body vb. opsiyonlar
      headers: headers,
    });

    // API'den veri dönmemesi durumundaki hataları işleme
    if (!response.ok) {
      let errorData: ApiErrorResponse | string;
      try {
        //Hata dönerse, JSON formatında dönecektir.
        errorData = await response.json();
      } catch (e) {
        //JSON okunmadıysa, text olarak oku
        console.log(e);
        errorData = await response.text();
      }
      console.log(`API Error (${response.status}): ${url}`, errorData);
      // Özel bir hata sınıfı
      throw new Error(
        typeof errorData === "object" && errorData.message
          ? errorData.message // API'den dönen hata mesajı
          : `Request failed with status ${response.status}` // genel hata mesajı
      );
    }

    if (response.status === 204) {
      return null as T; // 204 No Content durumunda boş döner
    }

    const data: T = await response.json(); // JSON formatında döner

    if (options.responseSchema) {
      // Eğer bir şema varsa, veriyi doğrula
      try {
        return options.responseSchema.parse(data); // Zod ile doğrula
      } catch (error) {
        if (error instanceof ZodError) {
          console.error("API Response Validation Error:", error.errors); // Zod hatalarını yazdır
          throw new Error(`API response validation failed ${error.errors}`); // Hata gönderimi
        }
        throw error; // Diğer hataları gönder
      }
    }
    return data; // Şema yoksa, veriyi döndür
  } catch (error) {
    console.log(`Network or other error calling API on ${url}:`, error); // Ağ hatası veya diğer hatalar
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Unknown error occurred while calling API.");
    }
  }
}

export default apiClient;
