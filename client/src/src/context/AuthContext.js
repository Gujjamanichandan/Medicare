import React, { createContext, useEffect, useState } from 'react';

// Create a context for authentication state
const AuthContext = createContext();

// AuthProvider component to wrap around your app and manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Loading state to manage initialization

  // Check if a user is logged in (check localStorage) when the app mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      // If user and token exist, set user state
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // Mark initialization as complete
  }, []);

  // Log out function
  const logout = () => {
    localStorage.removeItem('user'); // Remove user from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Reset user state
  };

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loader while checking auth state
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
