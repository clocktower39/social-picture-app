import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_PROD_BACKEND = "https://social-picture-app.herokuapp.com";

const resolveBackendUrl = (mode, env) => {
  const explicit = env.VITE_API_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (mode === "production") return DEFAULT_PROD_BACKEND;
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const host = window.location.hostname || "localhost";
    return `${protocol}//${host}:3003`;
  }
  return "http://localhost:3003";
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendURL = resolveBackendUrl(mode, env);
  return {
    plugins: [react()],
    define: {
      __BACKEND_URL__: JSON.stringify(backendURL),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "mui-vendor": [
              "@mui/material",
              "@mui/icons-material",
              "@mui/styles",
              "@mui/system",
              "@mui/x-date-pickers",
              "@emotion/react",
              "@emotion/styled",
            ],
            "redux-vendor": ["react-redux", "redux", "redux-thunk", "@redux-devtools/extension"],
            utils: ["axios", "jwt-decode", "socket.io-client"],
          },
        },
      },
    },
    base: "/social-picture-app/",
  };
});
