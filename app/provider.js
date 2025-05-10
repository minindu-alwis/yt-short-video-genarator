"use client";

import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/configs/fireBaseConfig';
import AuthContext from './_context/AuthContext';

function Provider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user, "check user");
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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
