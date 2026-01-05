import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

const commitHash = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

export default defineConfig({
  plugins: [react()],
  base: "/darkside-betting/",
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
});
