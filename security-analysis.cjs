// Security Analysis Script for Rural Properties Application
// This script checks for common security vulnerabilities and misconfigurations

const fs = require('fs');
const path = require('path');

console.log('🔒 COMPREHENSIVE SECURITY ANALYSIS');
console.log('=====================================\n');

// 1. Check for exposed sensitive information
console.log('1. CHECKING FOR EXPOSED SENSITIVE INFORMATION...\n');

const checkForSensitiveData = (filePath, fileName) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for API keys
  if (content.includes('AIza') || content.includes('AIzaSy')) {
    issues.push('Potential Google API key detected');
  }
  
  // Check for Firebase config exposure
  if (content.includes('firebaseConfig') && !filePath.includes('env')) {
    issues.push('Firebase config potentially exposed');
  }
  
  // Check for hardcoded passwords
  if (content.includes('password:') || content.includes('secret:')) {
    issues.push('Potential hardcoded credentials');
  }
  
  // Check for database connection strings
  if (content.includes('mongodb://') || content.includes('mysql://')) {
    issues.push('Database connection string potentially exposed');
  }
  
  return issues;
};

// Check key files
const sensitiveFiles = [
  'src/lib/firebase/config.ts',
  'src/services/databaseService.ts',
  'src/contexts/AuthContext.tsx',
  '.env',
  '.env.local',
  '.env.example'
];

sensitiveFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const issues = checkForSensitiveData(file, file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${file}: No exposed sensitive data detected`);
    }
  }
});

// 2. Check for authentication vulnerabilities
console.log('\n2. CHECKING AUTHENTICATION SECURITY...\n');

const checkAuthSecurity = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for proper validation
  if (!content.includes('validatePassword') && !content.includes('passwordValidation')) {
    issues.push('Missing password validation');
  }
  
  // Check for rate limiting
  if (!content.includes('rateLimit') && !content.includes('throttle')) {
    issues.push('No rate limiting detected');
  }
  
  // Check for session management
  if (!content.includes('session') && !content.includes('token')) {
    issues.push('Poor session management');
  }
  
  // Check for input sanitization
  if (!content.includes('sanitize') && !content.includes('escape')) {
    issues.push('Missing input sanitization');
  }
  
  return issues;
};

const authFiles = [
  'src/contexts/AuthContext.tsx',
  'src/services/userService.ts',
  'src/pages/SignIn.tsx',
  'src/pages/AdminSignIn.tsx'
];

authFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const issues = checkAuthSecurity(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${file}: Authentication security looks good`);
    }
  }
});

// 3. Check for XSS vulnerabilities
console.log('\n3. CHECKING FOR XSS VULNERABILITIES...\n');

const checkXSSVulnerabilities = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for dangerous innerHTML usage
  if (content.includes('innerHTML') || content.includes('dangerouslySetInnerHTML')) {
    issues.push('Potential XSS vulnerability - innerHTML usage');
  }
  
  // Check for eval usage
  if (content.includes('eval(') || content.includes('Function(')) {
    issues.push('Potential XSS vulnerability - eval usage');
  }
  
  // Check for unescaped user input
  if (content.includes('{userInput}') && !content.includes('escape')) {
    issues.push('Unescaped user input detected');
  }
  
  return issues;
};

const xssFiles = [
  'src/pages/PropertyDetails.tsx',
  'src/components/PropertyCard.tsx',
  'src/pages/Contact.tsx'
];

xssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const issues = checkXSSVulnerabilities(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${file}: No XSS vulnerabilities detected`);
    }
  }
});

// 4. Check for CORS and CSP issues
console.log('\n4. CHECKING CORS & CSP CONFIGURATION...\n');

const checkCORS_CSP = () => {
  const issues = [];
  
  // Check for CORS configuration
  if (fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js')) {
    const config = fs.readFileSync('vite.config.ts', 'utf8');
    if (!config.includes('cors') && !config.includes('CORS')) {
      issues.push('CORS not configured');
    }
  }
  
  // Check for CSP headers
  if (fs.existsSync('index.html')) {
    const html = fs.readFileSync('index.html', 'utf8');
    if (!html.includes('Content-Security-Policy')) {
      issues.push('Content Security Policy not set');
    }
  }
  
  return issues;
};

const corsIssues = checkCORS_CSP();
if (corsIssues.length > 0) {
  console.log('❌ CORS/CSP Issues:');
  corsIssues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('✅ CORS/CSP: Configuration looks good');
}

// 5. Check for dependency vulnerabilities
console.log('\n5. CHECKING DEPENDENCY VULNERABILITIES...\n');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  console.log('📦 Key Dependencies:');
  Object.keys(dependencies).forEach(dep => {
    console.log(`   - ${dep}@${dependencies[dep]}`);
  });
  
  // Check for known vulnerable packages
  const vulnerablePackages = [
    'lodash', // Check for old versions
    'axios', // Check for versions < 1.0.0
    'react', // Check for versions < 18.0.0
    'firebase' // Check for versions < 9.0.0
  ];
  
  vulnerablePackages.forEach(pkg => {
    if (dependencies[pkg]) {
      console.log(`⚠️  ${pkg}: Review version for vulnerabilities`);
    }
  });
}

// 6. Check for environment security
console.log('\n6. CHECKING ENVIRONMENT SECURITY...\n');

const envFiles = ['.env', '.env.local', '.env.production'];
let envSecurityScore = 0;

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('NODE_ENV=production')) {
      console.log('✅ Production environment detected');
    }
    
    if (content.includes('API_KEY') || content.includes('SECRET')) {
      console.log(`❌ ${file}: Contains sensitive data`);
    } else {
      console.log(`✅ ${file}: No sensitive data exposed`);
    }
  }
});

// 7. Check for Firebase security rules
console.log('\n7. CHECKING FIREBASE SECURITY RULES...\n');

if (fs.existsSync('firestore.rules')) {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  
  if (rules.includes('allow read, write: if true;')) {
    console.log('❌ Firestore rules: Too permissive - allows anyone to read/write');
  } else if (rules.includes('allow read: if true;')) {
    console.log('⚠️  Firestore rules: Read access too permissive');
  } else {
    console.log('✅ Firestore rules: Security rules look restrictive');
  }
} else {
  console.log('⚠️  Firestore rules: Not found');
}

// 8. Check for input validation
console.log('\n8. CHECKING INPUT VALIDATION...\n');

const validationFiles = [
  'src/pages/Contact.tsx',
  'src/pages/SignIn.tsx',
  'src/pages/SignUp.tsx'
];

validationFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('required') || content.includes('validation')) {
      console.log(`✅ ${file}: Input validation present`);
    } else {
      console.log(`❌ ${file}: Missing input validation`);
    }
  }
});

console.log('\n🔒 SECURITY ANALYSIS COMPLETE');
console.log('=====================================\n');
console.log('📋 SECURITY RECOMMENDATIONS:');
console.log('- Review and fix any identified issues');
console.log('- Implement proper input validation');
console.log('- Set up rate limiting');
console.log('- Configure CORS and CSP headers');
console.log('- Regular dependency updates');
console.log('- Secure Firebase rules');
console.log('- Environment variable protection');
console.log('\n🚀 DEPLOYMENT SECURITY CHECKLIST:');
console.log('[ ] All sensitive data secured');
console.log('[ ] Authentication properly implemented');
console.log('[ ] XSS protection in place');
console.log('[ ] CORS/CSP configured');
console.log('[ ] Dependencies updated');
console.log('[ ] Firebase rules restrictive');
console.log('[ ] Input validation complete');
console.log('[ ] Environment variables protected');
