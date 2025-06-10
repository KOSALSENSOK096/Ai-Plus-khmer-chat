// Code Complete Review: 20240815120000
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserPlan } from '../types';
import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../constants';
import { jwtDecode } from 'jwt-decode'; // Added import for jwt-decode
import type { DecodedJWT } from '../types'; // Added import for DecodedJWT
import { authService } from '../services/authService'; // Import authService


interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUserPlan: (plan: UserPlan) => void;
  updateUserProfilePicture: (newUrl: string | null) => void; 
  updateUserProfileInfo: (name: string, email: string) => Promise<void>; // Added function
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkTokenValidity = useCallback((authToken: string | null): boolean => {
    if (!authToken) return false;
    try {
      const decodedToken = jwtDecode<DecodedJWT>(authToken);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  }, []);
  
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUserRaw = localStorage.getItem(USER_INFO_KEY);

    if (storedToken && checkTokenValidity(storedToken) && storedUserRaw) {
      try {
        const storedUser: User = JSON.parse(storedUserRaw);
        setToken(storedToken);
        setUser(storedUser); // Includes profilePictureUrl if present
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
      }
    }
    setIsLoading(false);
  }, [checkTokenValidity]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData)); // userData now includes profilePictureUrl
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUserPlan = (plan: UserPlan) => {
    setUser(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, plan };
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  const updateUserProfilePicture = (newUrl: string | null) => {
    setUser(currentUser => {
      if (currentUser) {
        const updatedUser = { ...currentUser, profilePictureUrl: newUrl || undefined }; // Store undefined if null
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  const updateUserProfileInfo = async (name: string, email: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    // In a real app, this would be an API call. For mock, we update authService's DB.
    const updatedUserFromMockDB = await authService.updateUserProfileInMockDB(user.id, name, email);
    
    setUser(currentUser => {
      if (currentUser) {
        // Ensure plan and profilePictureUrl are preserved from current context user state
        // as mock DB update might not have these from other sessions/contexts.
        const finalUpdatedUser = { 
            ...updatedUserFromMockDB, // Has updated name, email, id
            plan: currentUser.plan, // Preserve current plan from context
            profilePictureUrl: currentUser.profilePictureUrl, // Preserve current pic from context
        };
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(finalUpdatedUser));
        return finalUpdatedUser;
      }
      return null;
    });
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        isAuthenticated: !!token && !!user && checkTokenValidity(token), 
        isLoading, 
        login, 
        logout, 
        updateUserPlan,
        updateUserProfilePicture,
        updateUserProfileInfo // Provide the new function
    }}>
      {children}
    </AuthContext.Provider>
  );
};