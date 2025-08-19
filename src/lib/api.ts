// src/api/getApiUrl.ts
import { Platform } from 'react-native'

export const getApiUrl = () => {
  // Use the environment variable if set (for production)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  // Otherwise, return the local dev URL based on platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:19006'  // Android emulator
  } else {
    return 'http://localhost:19006' // iOS simulator or web
  }
}
