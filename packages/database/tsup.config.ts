import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      moduleResolution: "bundler",
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["@prisma/client"],
});
