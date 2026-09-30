import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            lazy: async () => ({
              Component: (await import("@/features/home/pages/HomePage"))
                .HomePage,
            }),
          },
          { path: "*", element: <NotFoundPage /> },
          {
            path: "/training",
            lazy: async () => ({
              Component: (
                await import("@/features/training/pages/TrainingPage")
              ).TrainingPage,
            }),
          },
          {
            path: "/intakes",
            lazy: async () => ({
              Component: (
                await import("@/features/nutrition/pages/IntakeHistoryPage")
              ).IntakeHistoryPage,
            }),
          },
          {
            path: "/meals",
            lazy: async () => ({
              Component: (await import("@/features/nutrition/pages/MealsPage"))
                .MealsPage,
            }),
          },
        ],
      },
    ],
  },
]);
