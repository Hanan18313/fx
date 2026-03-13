import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  role: string | null;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,

  setAuth: async (token, role) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('role', role);
    set({ token, role });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    set({ token: null, role: null });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('token');
    const role = await AsyncStorage.getItem('role');
    if (token) set({ token, role });
  },
}));
