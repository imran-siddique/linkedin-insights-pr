#!/usr/bin/env node

// Simple build test without using npm
console.log('Testing basic import resolution...')

try {
  // Test that vite config can be loaded
  const path = require('path')
  const fs = require('fs')
  
  const projectRoot = '/workspaces/spark-temp
  
    'src/index.css',
    'package.json'
  
    const fullPath
      throw new Erro
    console.log(`✓ F
  
  const packageJso
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
  
  console.log('\n🎉 All basic
} catch (error) {
  process.exit(1)
















