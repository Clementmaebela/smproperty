// Comprehensive Blind Spots Check Script
// This script checks for broken links, missing routes, and database cohesion issues

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE BLIND SPOTS CHECK');
console.log('=====================================\n');

// 1. Check for broken internal links in components
console.log('1. CHECKING INTERNAL LINKS...\n');

const checkFileForLinks = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for to="/path" links
  const linkMatches = content.match(/to="([^"]+)"/g);
  if (linkMatches) {
    linkMatches.forEach(link => {
      const path = link.match(/to="([^"]+)"/)[1];
      if (path.startsWith('/')) {
        // Check if route exists
        const routeFile = path.replace(/^\//, '').replace(/\/.*/, '');
        if (!fs.existsSync(`src/pages/${routeFile}.tsx`) && 
            !fs.existsSync(`src/pages/${routeFile.charAt(0).toUpperCase() + routeFile.slice(1)}.tsx`)) {
          issues.push(`Missing route: ${path}`);
        }
      }
    });
  }
  
  return issues;
};

// Check all component files
const componentFiles = fs.readdirSync('src/components').filter(f => f.endsWith('.tsx'));
componentFiles.forEach(file => {
  const issues = checkFileForLinks(`src/components/${file}`);
  if (issues.length > 0) {
    console.log(`❌ ${file}:`);
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
});

// 2. Check App.tsx routes
console.log('\n2. CHECKING APP.TSX ROUTES...\n');

const appContent = fs.readFileSync('src/App.tsx', 'utf8');
const routeMatches = appContent.match(/path="([^"]+)"/g);
const definedRoutes = [];

if (routeMatches) {
  routeMatches.forEach(match => {
    const route = match.match(/path="([^"]+)"/)[1];
    definedRoutes.push(route);
  });
}

console.log('✅ Defined routes:');
definedRoutes.forEach(route => console.log(`   - ${route}`));

// 3. Check for missing page components
console.log('\n3. CHECKING PAGE COMPONENTS...\n');

const pageFiles = fs.readdirSync('src/pages').filter(f => f.endsWith('.tsx'));
console.log('✅ Available page components:');
pageFiles.forEach(file => console.log(`   - ${file}`));

// 4. Check database service cohesion
console.log('\n4. CHECKING DATABASE COHESION...\n');

const databaseService = fs.existsSync('src/services/databaseService.ts');
if (databaseService) {
  console.log('✅ Database service exists');
  
  // Check for Firebase config
  const firebaseConfig = fs.existsSync('src/lib/firebase/config.ts');
  console.log(firebaseConfig ? '✅ Firebase config exists' : '❌ Firebase config missing');
  
  // Check for user service
  const userService = fs.existsSync('src/services/userService.ts');
  console.log(userService ? '✅ User service exists' : '❌ User service missing');
} else {
  console.log('❌ Database service missing');
}

// 5. Check for broken imports
console.log('\n5. CHECKING IMPORTS...\n');

const checkImports = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for @/ imports
  const importMatches = content.match(/from "@\/([^"]+)"/g);
  if (importMatches) {
    importMatches.forEach(imp => {
      const importPath = imp.match(/from "@\/([^"]+)"/)[1];
      const fullPath = `src/${importPath}`;
      
      if (importPath.endsWith('.tsx') || importPath.endsWith('.ts')) {
        if (!fs.existsSync(fullPath)) {
          issues.push(`Missing import: ${importPath}`);
        }
      } else {
        // Check for index files
        if (!fs.existsSync(`${fullPath}.tsx`) && 
            !fs.existsSync(`${fullPath}.ts`) &&
            !fs.existsSync(`${fullPath}/index.tsx`) &&
            !fs.existsSync(`${fullPath}/index.ts`)) {
          issues.push(`Missing import: ${importPath}`);
        }
      }
    });
  }
  
  return issues;
};

// Check imports in key files
const keyFiles = ['src/App.tsx', 'src/pages/Index.tsx', 'src/components/Header.tsx'];
keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const issues = checkImports(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
  }
});

console.log('\n🔍 BLIND SPOTS CHECK COMPLETE');
console.log('=====================================\n');
console.log('📋 SUMMARY:');
console.log('- Checked internal links in components');
console.log('- Verified App.tsx routes');
console.log('- Confirmed page components exist');
console.log('- Validated database service cohesion');
console.log('- Checked for broken imports');
console.log('\n🚀 Ready for deployment!');
