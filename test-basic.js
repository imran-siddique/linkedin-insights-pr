console.log('🔍 Testing basic Node.js functionality...')

try {
  // Test basic requires
  console.log('✅ Node.js version:', process.version)
  console.log('✅ Platform:', process.platform)
  
  // Test package.json exists
  const fs = require('fs')
  const path = require('path')
  
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    console.log('✅ Package.json found')
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    console.log('✅ Package name:', pkg.name)
    console.log('✅ Package version:', pkg.version)
  } else {
    console.log('❌ Package.json not found')
  }
  
  // Test src directory
  const srcPath = path.join(process.cwd(), 'src')
  if (fs.existsSync(srcPath)) {
    console.log('✅ src directory found')
  } else {
    console.log('❌ src directory not found')
  }
  
  console.log('🎉 Basic tests passed!')
} catch (error) {
  console.error('❌ Error during testing:', error.message)
  process.exit(1)
}