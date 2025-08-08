#!/usr/bin/env node

// Build validation test
console.log('🔍 Testing build configuration...')

const fs = require('fs')
const path = require('path')

const projectRoot = '/workspaces/spark-template'

try {
  // Check main files exist
  const mainFiles = [
    'src/main.tsx',
    'src/App.tsx',
    'src/main.css',
    'src/index.css',
    'index.html',
    'package.json',
    'tailwind.config.js',
    'vite.config.ts'
  ]
  
  console.log('Checking required files...')
  for (const file of mainFiles) {
    const fullPath = path.join(projectRoot, file)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required file: ${file}`)
    }
    console.log(`✓ Found ${file}`)
  }
  
  // Check main.css doesn't have problematic imports
  console.log('\nChecking CSS files...')
  const mainCssPath = path.join(projectRoot, 'src/main.css')
  const mainCssContent = fs.readFileSync(mainCssPath, 'utf8')
  
  if (mainCssContent.includes(`@import 'tailwindcss'`)) {
    throw new Error('main.css contains problematic @import tailwindcss')
  }
  
  if (!mainCssContent.includes('@tailwind base')) {
    throw new Error('main.css missing @tailwind base')
  }
  
  console.log('✓ main.css has correct Tailwind directives')
  
  // Check index.css 
  const indexCssPath = path.join(projectRoot, 'src/index.css')
  const indexCssContent = fs.readFileSync(indexCssPath, 'utf8')
  
  if (indexCssContent.includes(`@import 'tailwindcss'`)) {
    throw new Error('index.css contains problematic @import tailwindcss')
  }
  
  if (!indexCssContent.includes('@tailwind base')) {
    throw new Error('index.css missing @tailwind base')
  }
  
  console.log('✓ index.css has correct Tailwind directives')
  
  // Check package.json dependencies
  console.log('\nChecking dependencies...')
  const packageJsonPath = path.join(projectRoot, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  
  const requiredDeps = [
    'react',
    'react-dom', 
    'vite',
    'tailwindcss',
    '@phosphor-icons/react'
  ]
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      throw new Error(`Missing required dependency: ${dep}`)
    }
    console.log(`✓ Found dependency ${dep}`)
  }
  
  // Check App.tsx imports
  console.log('\nChecking App.tsx imports...')
  const appTsxPath = path.join(projectRoot, 'src/App.tsx')
  const appTsxContent = fs.readFileSync(appTsxPath, 'utf8')
  
  if (!appTsxContent.includes(`import { useKV } from '@github/spark/hooks'`)) {
    throw new Error('App.tsx missing correct useKV import')
  }
  
  console.log('✓ App.tsx has correct useKV import')
  
  console.log('\n🎉 All validation checks passed!')
  console.log('The build configuration should now work correctly.')
  process.exit(0)
  
} catch (error) {
  console.error('\n❌ Build validation failed!')
  console.error(error.message)
  process.exit(1)
}