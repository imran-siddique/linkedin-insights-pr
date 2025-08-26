import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

  plugins: [react()],
    environment: 'jsd
    globa
    coverage: {
      exclude: [
        'src/test/
        'vite.
      ],
  },
    alias: {
    },
})
        '**/*.d.ts',
        'vite.config.ts',
        'vitest.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})