import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";
import AppErrorBoundary from "./components/AppErrorBoundary";
import AppStoreProvider from "./components/AppStoreProvider";
import AuthGuard from "./components/AuthGuard";
import LoadingModal from "./components/LoadingModal";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import RoundsListPage from "./pages/RoundsPage";

type ExtendedRouteObject = RouteObject & {
  protected?: boolean;
};

const protectedRoutes: ExtendedRouteObject[] = [
  {
    path: "/",
    hasErrorBoundary: true,
    element: <RoundsListPage />,
    errorElement: <AppErrorBoundary />,
    protected: true,
    index: true,
  },
  {
    path: "/play",
    hasErrorBoundary: true,
    element: <GamePage />,
    errorElement: <AppErrorBoundary />,
    protected: true,
    index: true,
  },
];

const unProtectedRoute: ExtendedRouteObject[] = [
  {
    path: "/login",
    hasErrorBoundary: true,
    element: <LoginPage />,
    errorElement: <AppErrorBoundary />,
    index: true,
  },
  {
    path: "/register",
    hasErrorBoundary: true,
    element: <RegisterPage />,
    errorElement: <AppErrorBoundary />,
    protected: true,
    index: true,
  },
];

const appRoutes = [...unProtectedRoute, ...protectedRoutes].map((route) => {
  if (route?.protected && route?.element) {
    route.element = <AuthGuard>{route.element}</AuthGuard>;
  }

  return route;
});

const router = createBrowserRouter(appRoutes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180_000,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Suspense fallback={<LoadingModal />}>
            <AppStoreProvider>
              <RouterProvider router={router} />
            </AppStoreProvider>
          </Suspense>
        </LocalizationProvider>

        <Toaster richColors position="top-right" theme="light" />
        {/* <AppModals /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
