import react from "@vitejs/plugin-react"
import { defineConfig, PluginOption } from "vite"
import { resolve } from 'path'

import sparkPlugin from "@github/spark/spark-vite-plugin"
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin"

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
      // DO NOT REMOVE
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    optimizeDeps: {
      exclude: ['@github/spark']
    },
    build: {
      // Production optimization
      minify: isProd ? 'terser' : false,
      sourcemap: isDev || process.env.VITE_SOURCE_MAP === 'true',
      target: 'esnext',
      
      // Simplified rollup options to avoid issues
      rollupOptions: {
        external: (id) => {
          // Don't try to bundle spark runtime dependencies
          return id.includes('@github/spark')
        }
      },
      
      // Build size warnings
      chunkSizeWarningLimit: 1000, // KB
    },
    
    // Development server configuration
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      cors: true,
      hmr: {
        overlay: isDev
      }
    },
    
    // Preview server (for production builds)
    preview: {
      host: true,
      port: 4173,
      strictPort: false,
      cors: true
    },
    
    // Environment variable prefix
    envPrefix: ['VITE_', 'NODE_'],
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    }
  }
})
