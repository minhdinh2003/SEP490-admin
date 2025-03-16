'use client';

import { AUTH_STORAGE_KEY } from '@/constants/local-storage-key';
import { UserRole } from '@/enum/user-role';
import {
  //x
  getCurrentUserService,
  SignInParams,
  signInService,
  signOutService,
  SignUpParams,
  signUpService,
  guestSignUpService
} from '@/services/auth.service';
import AuthService from '@/services/authService';
// Importing create function from the Zustand library
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Defining an interface for the store's state
interface AuthStoreInterface {
  authenticated: boolean; // a boolean value indicating whether the user is authenticated or not
  setAuthentication: (val: boolean) => void; // a function to set the authentication status
  user: any; // an object that stores user information
  setUser: (user: any) => void; // a function to set user information
  token: string | null;
  setToken: (token: string | null) => void;
  role: UserRole;
  userId: number;
  email: string | null;
  fullName: string | null;
  setRole: (role: UserRole) => void;
  logIn: (params: SignInParams) => Promise<any>;
  signUp: (params: SignUpParams) => Promise<any>;
  guestSignUp: (params: SignUpParams) => Promise<any>;
  signOut: () => Promise<any>;
  getCurrentUser: () => Promise<any>;
}

// create our store
export const useAuthStore = create(
  persist<AuthStoreInterface>(
    (set) => ({
      authenticated: false, // initial value of authenticated property
      user: {}, // initial value of user property
      setAuthentication: (val) => set((state) => ({ authenticated: val })), // function to set the authentication status
      setUser: (user) => set({ user }), // function to set user information
      token: null,
      setToken: (token: string | null) => set({ token }),
      role: UserRole.OTHER,
      userId: -1,
      email: '',
      fullName: '',
      setRole: (role: UserRole) => set({ role }),
      logIn: async (params: SignInParams) => {
        const response = await AuthService.login(params);
        set({
          authenticated: true,
          // user: response.data,
          token: response.data.token,
          role: response.data.role,
          userId: response.data.id,
          email: response.data.email,
          fullName: response.data.fullName
        });
        Cookies.set('auth_token', response.data.token, { expires: 7 });
        Cookies.set('role', response.data.role);
        Cookies.set('authenticated', 'true');
        return response;
      },
      signUp: async (params: SignUpParams) => {
        const response = await signUpService(params);
        return response;
      },
      guestSignUp: async (params: SignUpParams) => {
        const response = await guestSignUpService(params);
        if (response?.success) {
          set({
            authenticated: true,
            // user: response.data,
            token: response.data.token,
            role: UserRole.ADMIN
          });
        }
        return response;
      },
      signOut: async () => {
        // const response = await signOutService();
        debugger;
        set({
          authenticated: false,
          user: {},
          token: null,
          role: UserRole.OTHER
        });
        return {};
      },
      getCurrentUser: async () => {
        const response = await getCurrentUserService();
        set({ user: response.data });
        return response;
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
