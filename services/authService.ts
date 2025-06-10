// Code Complete Review: 20240815120000
import { User, UserPlan } from '../types';

// Mock database for users
const usersDB: User[] = [];

// In a real app, the token would be a real JWT from a backend
const generateMockJWT = (user: User): string => {
  const payload = { userId: user.id, email: user.email, name: user.name, plan: user.plan, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }; // Expires in 24 hours
  return `mockJWT.${btoa(JSON.stringify(payload))}`; // Simple base64 encoding for mock
};


export const authService = {
  register: async (name: string, email: string, password?: string): Promise<{user: User, token: string}> => {
    // Password would be hashed and stored securely in a real backend
    console.log('Registering user with password (mock):', password ? 'provided' : 'not provided');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (usersDB.find(u => u.email === email)) {
          reject(new Error('User with this email already exists.'));
          return;
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          name,
          plan: UserPlan.FREE,
        };
        usersDB.push(newUser);
        const token = generateMockJWT(newUser);
        resolve({ user: newUser, token });
      }, 500);
    });
  },

  login: async (email: string, password?: string): Promise<{user: User, token: string}> => {
    // Password would be verified against a stored hash in a real backend
     console.log('Logging in user with password (mock):', password ? 'provided' : 'not provided');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = usersDB.find(u => u.email === email);
        // Mock password check if one was provided during registration/login in a real scenario
        if (user) {
          const token = generateMockJWT(user);
          resolve({ user, token });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  },

  updateUserProfileInMockDB: async (userId: string, newName: string, newEmail: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = usersDB.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          reject(new Error('User not found in mock DB.'));
          return;
        }
        // Check if new email already exists for another user (simple mock validation)
        const emailExistsForOtherUser = usersDB.some(u => u.email === newEmail && u.id !== userId);
        if (emailExistsForOtherUser) {
          reject(new Error('This email address is already in use by another account.'));
          return;
        }

        const updatedUser = {
          ...usersDB[userIndex],
          name: newName,
          email: newEmail,
        };
        usersDB[userIndex] = updatedUser;
        resolve(updatedUser);
      }, 300); // Simulate async operation
    });
  }
  // Logout is handled by clearing token/user in AuthContext
};