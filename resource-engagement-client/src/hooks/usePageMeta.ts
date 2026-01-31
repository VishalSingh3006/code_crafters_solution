import { useLocation } from "react-router-dom";

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

const pageMetadata: Record<string, PageMeta> = {
  "/": {
    title: "Home",
    description:
      "Welcome to our React application with MUI, Tailwind, Router, Redux and React Hook Form",
    keywords: "react, home, welcome, typescript, mui, tailwind",
  },
  "/login": {
    title: "Login",
    description:
      "Sign in to your account to access your dashboard and manage your profile",
    keywords: "login, signin, authentication, access, account",
  },
  "/signup": {
    title: "Sign Up",
    description:
      "Create a new account to get started with our platform and access all features",
    keywords: "signup, register, create account, new user, registration",
  },
  "/dashboard": {
    title: "Dashboard",
    description: "View your account overview and statistics",
    keywords: "dashboard, account, overview, statistics, user",
  },
  "/profile": {
    title: "Profile",
    description: "Manage your account information and settings",
    keywords: "profile, account, settings, user information, personal",
  },
  "/2fa/setup": {
    title: "Two-Factor Authentication Setup",
    description:
      "Set up two-factor authentication to secure your account with an additional layer of protection",
    keywords: "2fa, two factor authentication, security, setup, protection",
  },
};

export function usePageMeta(customMeta?: Partial<PageMeta>): PageMeta {
  const location = useLocation();

  const defaultMeta = pageMetadata[location.pathname] || {
    title: "Hackathon App",
    description: "A modern React application with authentication and dashboard",
    keywords: "react, typescript, mui, authentication, dashboard",
  };

  return {
    ...defaultMeta,
    ...customMeta,
  };
}
