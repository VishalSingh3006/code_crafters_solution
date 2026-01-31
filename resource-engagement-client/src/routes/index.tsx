import type { RouteObject } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequirePermission from "./RequirePermission";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import { lazy } from "react";

const Home = lazy(() => import("../screens/Home"));
const Dashboard = lazy(() => import("../screens/Dashboard"));
const ErrorPage = lazy(() => import("../screens/ErrorPage"));
const Profile = lazy(() => import("../screens/Profile"));
const TwoFactorSetup = lazy(() => import("../features/auth/TwoFactorSetup"));
const TwoFactorVerify = lazy(() => import("../features/auth/TwoFactorVerify"));
const TwoFactorVerifyLogin = lazy(
  () => import("../features/auth/TwoFactorVerifyLogin"),
);
const TwoFactorManage = lazy(() => import("../features/auth/TwoFactorManage"));
const TwoFactorStatus = lazy(() => import("../features/auth/TwoFactorStatus"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/2fa/verify",
    element: <TwoFactorVerifyLogin />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/2fa/setup",
        element: <TwoFactorSetup />,
      },
      {
        path: "/2fa/verify",
        element: <TwoFactorVerify />,
      },
      {
        element: <RequirePermission required={["MANAGE_2FA"]} />,
        children: [
          {
            path: "/2fa/manage",
            element: <TwoFactorManage />,
          },
        ],
      },
      {
        path: "/2fa/status",
        element: <TwoFactorStatus />,
      },
    ],
  },
];
