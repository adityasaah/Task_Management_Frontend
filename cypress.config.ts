import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  component: {
    supportFile: './cypress/support/component.ts',
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        // ✅ explicitly tell vite where public dir is
        publicDir: 'public',
      },
    },
  },
});
