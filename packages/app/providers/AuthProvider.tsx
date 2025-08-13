// packages/app/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@finlite/core';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<{ session: Session | null }>({ session: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the session
export const useAuth = () => useContext(AuthContext);