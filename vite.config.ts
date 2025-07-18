import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
});
