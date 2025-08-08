// Simple build test to verify configuration
import { build } from 'vite'
import { readFileSync } from '
const projectRoot = process.cwd()

console.log('🔍 Checking Vite con
  const viteConfigContent = readFileSync(viteConfigPath, 'utf

  if (viteConfigContent.includes('@tailwindcss/v
    process.exit(1)
    c
} catch (error) {
  process.exit(1)







  }
} catch (error) {
  console.error('❌ Error reading vite config:', error.message)
  process.exit(1)
}

console.log('🎉 Configuration check passed!')