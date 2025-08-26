import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

const projectRoot = process.env.PROJECT_ROOT || fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    build: {
      // Production optimization
      minify: isProd ? 'terser' : false,
      sourcemap: isDev || process.env.VITE_SOURCE_MAP === 'true',
      target: 'esnext',
      
      // Better chunk splitting for caching
      rollupOptions: {
        output: {
          // Optimize chunk splitting
          manualChunks: isProd ? {
            // Separate vendor chunks for better caching
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-checkbox', '@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-progress', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
            'icons-vendor': ['@phosphor-icons/react'],
            'utils-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          } : undefined,
          // Add hashes to filenames for better caching
          chunkFileNames: isProd ? '[name].[hash].js' : '[name].js',
          entryFileNames: isProd ? '[name].[hash].js' : '[name].js',
          assetFileNames: isProd ? '[name].[hash].[ext]' : '[name].[ext]',
        }
      },
      
      // Terser options for production
      terserOptions: isProd ? {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
      } : undefined,
      
      // Build size warnings
      chunkSizeWarningLimit: 1000, // KB
    },
    
    // Development server configuration
    server: {
      host: true, // Allow external connections
      port: 5173,
      strictPort: false,
      // Enable CORS for development
      cors: true,
      // Hot module replacement
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
