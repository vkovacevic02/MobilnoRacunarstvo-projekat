export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api', // Vaš Laravel backend URL
  ENDPOINTS: {
    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    
    // Travel
    PUTOVANJA: '/putovanja',
    ARANZMANI: '/aranzmani',
    PLAN_ARANZMANA: '/plan-aranzmana',
    
    // Users
    USERS: '/users',
    PUTNICI: '/putnici',
    
    // Payments
    UPLATE: '/uplate',
    
    // Search
    PRETRAZI_GRADOVE: '/pretrazi-gradove',
    PRETRAZI_OBLASTI: '/pretrazi-oblasti',
  },
  
  TIMEOUT: 10000, // 10 seconds
};
