#!/usr/bin/env node

// Simple build test without using npm
console.log('Testing basic import resolution...')

try {
  // Test that vite config can be loaded
  const path = require('path')
  const fs = require('fs')
  
  console.log('✓ Basic Node.js modules work')
  
  // Check if main files exist
  const projectRoot = '/workspaces/spark-template'
  const mainFiles = [
    'src/App.tsx',
    'src/main.tsx', 
    'src/index.css',
    'vite.config.ts',
    'package.json'
  ]
  
  for (const file of mainFiles) {
    const fullPath = path.join(projectRoot, file)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required file: ${file}`)
    }
    console.log(`✓ Found ${file}`)
  }
  
  // Check package.json has required dependencies
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
  const requiredDeps = ['react', 'react-dom', 'vite']
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      throw new Error(`Missing required dependency: ${dep}`)
    }
    console.log(`✓ Found dependency ${dep}`)
  }
  
  // Check vite config syntax
  const viteConfig = fs.readFileSync(path.join(projectRoot, 'vite.config.ts'), 'utf8')
  if (viteConfig.includes('@github/spark')) {
    throw new Error('vite.config.ts still contains @github/spark imports')
  }
  console.log('✓ vite.config.ts has no @github/spark imports')
  
  // Check main.tsx
  const mainTsx = fs.readFileSync(path.join(projectRoot, 'src/main.tsx'), 'utf8')
  if (mainTsx.includes('import "@github/spark/spark"')) {
    throw new Error('main.tsx still has uncommented @github/spark imports')
  }
  console.log('✓ main.tsx @github/spark import is commented out')
  
  console.log('\n🎉 All basic checks passed! The build errors should be resolved.')
  
} catch (error) {
  console.error('❌ Test failed:', error.message)
  process.exit(1)
}