import { Platform } from 'react-native';

// Prefer EXPO_PUBLIC_API_URL when running on a real device or custom network
// e.g. EXPO_PUBLIC_API_URL=http://192.168.1.20:8000
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
const BASE = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export const API_CONFIG = {
  BASE_URL: `${BASE}/api`,
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
