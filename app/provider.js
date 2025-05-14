"use client";

import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/configs/fireBaseConfig';
import AuthContext from './_context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function Provider({ children }) {
  const [user, setUser] = useState(null); // Initialize as null

  const CreateUser = useMutation(api.users.CreateNewUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user, "check user");
      setUser(user);

      // Only create user if user exists and has necessary properties
      if (user) {
        try {
          const result = await CreateUser({
            name: user.displayName || '', // Provide fallback for null values
            email: user.email || '',
            pictureURL: user.photoURL || '',
          });
          console.log(result, "check result");
          setUser(result); // Update user state with the result
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [CreateUser]);

  return (
    <AuthContext.Provider value={{ user }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

export default Provider;