import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
