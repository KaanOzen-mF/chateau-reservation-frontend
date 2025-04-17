# Chateau Reservation Frontend

This project contains the user interface (UI) for the Chateau Reservation System. It was developed using Next.js.

## 🚀 Technologies

The main technologies and libraries used in this project are:

- **Framework:** [Next.js](https://nextjs.org/) (v15.3.0)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (`@radix-ui/react-label`, `@radix-ui/react-slot`), [lucide-react](https://lucide.dev/) (Icons) - _(Likely using a structure similar to [Shadcn/ui](https://ui.shadcn.com/))_
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Form Management & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- **API Requests:** [Axios](https://axios-http.com/)
- **API Requests:** Custom apiClient function built on top of the built-in `Workspace` API (located within `lib/apiClient.ts`). This function has capabilities for JWT token management, automatic JSON processing, error handling, and response validation with Zod.
- **Theme Support:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Development Tool:** [Turbopack](https://turbo.build/pack) (with `npm run dev`)
- **Linting:** [ESLint](https://eslint.org/) (with Next.js configuration)

## 📋 Prerequisites

Ensure that the following software is installed on your local machine before running the project:

- [Node.js](https://nodejs.org/) (Recommended version: >= 20.x)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## ⚙️ Installation and Running

1.  **Clone the Repository:**

    ```bash
    git clone <https://github.com/KaanOzen-mF/chateau-reservation-frontend> # Add your repository's URL here
    cd chateau-reservation-frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set Up Environment Variables:**
    Create a file named `.env.local` in the project's root directory and add your backend API address to it:

    ```plaintext
    # .env.local
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

    _Note: Update this value if your backend project is running on a different port or address._

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will run by default at `http://localhost:3000`. Open this address in your browser.

## ✨ Current Features

- User Sign-up
- User Sign-in
- _(Other features to be added)_

## 📁 Project Structure (Summary)

The main folder structure of the project is as follows:

## /app Directory Structure and Routing (Next.js App Router)

The project uses the Next.js App Router. The key files and folders within the `/app` directory are organized as follows:

```plaintext
app/
├── (auth)/                  # Route Group for Authentication Pages
│   ├── layout.tsx           # Layout specific to auth pages
│   ├── sign-in/
│   │   └── page.tsx         # Sign In page component (/sign-in)
│   └── sign-up/
│       └── page.tsx         # Sign Up page component (/sign-up)
├── layout.tsx               # Root layout for the entire application
├── page.tsx                 # Root page (Homepage: /)
├── globals.css              # Global CSS styles
└── favicon.ico              # Application favicon
```

## Root Files

- **`app/layout.tsx`**: The main layout component that wraps all pages. It likely includes shared elements like HTML structure, body tags, and potentially global context providers.
- **`app/page.tsx`**: The component rendered for the root URL (`/`). This is the homepage of the application.
- **`app/globals.css`**: Contains global styles applied throughout the application, often used with Tailwind CSS base styles and utilities.

### Authentication Route Group (`/app/(auth)`)

- **Route Group (`(auth)`)**: This directory uses parentheses `()` to create a Route Group. This organizes the sign-in and sign-up routes together without affecting their URL paths (i.e., the routes are `/sign-in` and `/sign-up`, not `/auth/sign-in`). This grouping is primarily used to apply a shared layout (`app/(auth)/layout.tsx`) to these specific routes.

- **`app/(auth)/layout.tsx` (Auth Layout)**:

  - **Purpose**: Provides a shared layout specifically for the authentication pages (`/sign-in`, `/sign-up`).
  - **Functionality**:
    - Centers content vertically and horizontally on the screen with a distinct background.
    - Includes the `Toaster` component from `sonner` for displaying notifications.
    - **Route Protection**: Checks the authentication state using `useAuthStore` (Zustand). If a user token is found (meaning the user is logged in), it automatically redirects the user away from the auth pages (e.g., to the homepage `/`) using `useRouter().replace('/')`.
    - **Hydration Handling**: Manages the Zustand store's hydration state (`isHydrated`) to prevent rendering flashes or incorrect redirects before the client-side auth state is loaded. Displays a loading spinner (`Loader2`) until hydration is complete or redirection occurs.

- **`app/(auth)/sign-in/page.tsx` (Sign In Page)**:

  - **Route**: `/sign-in`
  - **Purpose**: Displays the user login form and handles the sign-in process.
  - **Features**:
    - Uses `react-hook-form` for form state management.
    - Uses `zod` (`signInSchema`) for input validation (email, password).
    - Calls the backend login endpoint (`/api/auth/login`) using the custom `apiClient` upon form submission.
    - On successful login:
      - Stores the received `accessToken` in the Zustand store using `useAuthStore().login()`.
      - Shows a success toast notification using `sonner`.
      - Redirects the user to the homepage (`/`) using `useRouter().push('/')`.
    - Handles loading state (`isLoading`) to disable form elements during submission.
    - Displays error messages using `sonner` if the login fails.
    - Provides a link to the Sign Up page (`/sign-up`).
  - **UI**: Built using Shadcn/ui components (`Card`, `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`).

- **`app/(auth)/sign-up/page.tsx` (Sign Up Page)**:
  - **Route**: `/sign-up`
  - **Purpose**: Displays the user registration form and handles the sign-up process.
  - **Features**:
    - Uses `react-hook-form` for form state management.
    - Uses `zod` (`signUpSchema`) for input validation (first name, last name, email, password, password confirmation match).
    - Calls the backend registration endpoint (`/api/user/register`) using `apiClient` upon form submission.
    - On successful registration:
      - Shows a success toast notification using `sonner`.
      - Redirects the user to the homepage (`/`) using `useRouter().push('/')`. (Note: It might be more user-friendly to redirect to `/sign-in` after successful registration).
    - Handles loading state (`isLoading`).
    - Displays error messages using `sonner` if registration fails.
    - Provides a link to the Sign In page (`/sign-in`).
  - **UI**: Built using Shadcn/ui components (`Card`, `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`).

* `components/`: Reusable UI components (e.g., Button, Input, Forms).

## `/lib` Directory - Utilities and Core Logic

The `/lib` directory contains helper functions, core logic modules, and utility type definitions used across the application.

```plaintext
lib/
├── api.ts       # Central API client function
├── auth.ts      # Authentication related type definitions
└── utils.ts     # General utility functions (e.g., className helper)
```

### `lib/api.ts`

**Purpose:** Provides a centralized asynchronous function (`apiClient`) for making requests to the backend API.

**Functionality:**

- Built on top of the native Workspace API.
- Reads the base URL for the API from the `NEXT_PUBLIC_API_BASE_URL` environment variable.
- Sets default headers (`Content-Type: application/json`).
- Automatically adds the `Authorization: Bearer <token>` header if a token is provided in the request options (useful for authenticated requests).
- Handles API error responses, attempting to parse JSON error messages from the backend.
- Supports optional response validation using `ZodSchema` passed in the `responseSchema` option. If validation fails, it throws an error.
- Handles network errors and other exceptions during the fetch process.

**Usage:** Imported and used wherever the frontend needs to communicate with the backend API.

```plaintext
import apiClient from '@/lib/api';
import { userSchema } from '@/schemas/userSchema'; // Assuming a Zod schema exists

async function getUserProfile(token: string) {
  const user = await apiClient<User>('/api/users/profile', {
    method: 'GET',
    token: token,
    responseSchema: userSchema
  });
  return user;
}

```

- `store/`: Stores for Zustand state management (e.g., authStore).
- `styles/`: Global CSS files.
- `public/`: Static files (images, fonts, etc.).

## 🔗 Backend Connection

This frontend project communicates with the backend API located at:

- **Backend Repository:** `https://github.com/KaanOzen-mF/chateau-reservation-backend`

---

_This document should be updated as the project evolves._

```

```
