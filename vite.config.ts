import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: command !== 'serve' ? '/Online-shoe-store/' : '/',
    define: {
      // 'process.env.BASE_API_URL': JSON.stringify(env.BASE_API_URL),
      // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
      // If you want to exposes all env variables, which is not recommended
      'process.env': env
    },
  };
});
