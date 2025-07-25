import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const isDev = mode === "development";
    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: isDev
                ? {
                      "/api": {
                          target: "https://localhost:7133",
                          secure: false,
                      },
                  }
                : undefined,
        },
    };
});
