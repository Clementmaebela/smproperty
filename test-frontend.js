// Frontend Testing Script
console.log('🧪 Starting Frontend Testing...');

// Test 1: Check if we're on the right page
console.log('📍 Current URL:', window.location.href);

// Test 2: Check if main elements are loaded
const checkPageElements = () => {
  const elements = {
    header: document.querySelector('header'),
    main: document.querySelector('main'),
    footer: document.querySelector('footer'),
    propertyCards: document.querySelectorAll('[data-testid="property-card"]'),
    searchInput: document.querySelector('input[placeholder*="search"]'),
    filterButtons: document.querySelectorAll('button'),
    loadingSpinner: document.querySelector('.animate-spin')
  };
  
  console.log('📋 Page Elements Status:');
  Object.entries(elements).forEach(([key, element]) => {
    if (element) {
      if (element.length) {
        console.log(`✅ ${key}: ${element.length} elements found`);
      } else {
        console.log(`✅ ${key}: Element found`);
      }
    } else {
      console.log(`❌ ${key}: Element not found`);
    }
  });
  
  return elements;
};

// Test 3: Check for console errors
const checkConsoleErrors = () => {
  const originalError = console.error;
  const errors = [];
  
  console.error = (...args) => {
    errors.push(args);
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    if (errors.length > 0) {
      console.log('❌ Console Errors Found:', errors);
    } else {
      console.log('✅ No console errors detected');
    }
    console.error = originalError;
  }, 1000);
};

// Test 4: Check network requests
const checkNetworkRequests = () => {
  const originalFetch = window.fetch;
  const requests = [];
  
  window.fetch = (...args) => {
    requests.push(args[0]);
    return originalFetch.apply(window, args);
  };
  
  setTimeout(() => {
    console.log('🌐 Network Requests:', requests);
    const firestoreRequests = requests.filter(url => url.includes('firestore.googleapis.com'));
    console.log(`🔥 Firestore Requests: ${firestoreRequests.length}`);
    window.fetch = originalFetch;
  }, 2000);
};

// Test 5: Check if properties are loaded
const checkPropertiesLoaded = () => {
  setTimeout(() => {
    const propertyCards = document.querySelectorAll('[data-testid="property-card"], .property-card, [class*="property"]');
    console.log(`🏠 Properties Loaded: ${propertyCards.length} property cards found`);
    
    if (propertyCards.length > 0) {
      console.log('✅ Properties are loading correctly');
      propertyCards.forEach((card, index) => {
        const title = card.querySelector('h3, [class*="title"]');
        const price = card.querySelector('[class*="price"]');
        const location = card.querySelector('[class*="location"]');
        
        console.log(`📋 Property ${index + 1}:`, {
          title: title?.textContent || 'Not found',
          price: price?.textContent || 'Not found', 
          location: location?.textContent || 'Not found'
        });
      });
    } else {
      console.log('❌ No properties found on page');
    }
  }, 3000);
};

// Run all tests
checkPageElements();
checkConsoleErrors();
checkNetworkRequests();
checkPropertiesLoaded();

console.log('🎯 Testing script initialized - monitoring page...');
