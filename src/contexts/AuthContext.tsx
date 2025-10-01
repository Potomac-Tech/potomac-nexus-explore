import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithSAML: (domain: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithMicrosoft: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Log security event and create/update profile
          setTimeout(async () => {
            try {
              await supabase.rpc('log_security_event', {
                p_user_id: session.user.id,
                p_event_type: 'SIGN_IN',
                p_event_description: 'User signed in successfully',
                p_risk_level: 'low'
              });

              // Create or update user profile
              await supabase.from('profiles').upsert({
                user_id: session.user.id,
                display_name: session.user.email?.split('@')[0],
                last_login: new Date().toISOString(),
              });
            } catch (error) {
              console.error('Error logging security event:', error);
            }
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setTimeout(async () => {
            try {
              await supabase.rpc('log_security_event', {
                p_user_id: user?.id,
                p_event_type: 'SIGN_OUT',
                p_event_description: 'User signed out',
                p_risk_level: 'low'
              });
            } catch (error) {
              console.error('Error logging security event:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo: `${window.location.origin}/`,
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut({ scope: 'global' });
  };

  const signInWithSAML = async (domain: string) => {
    const { error } = await supabase.auth.signInWithSSO({
      domain,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signInWithMicrosoft = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'email'
      }
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithSAML,
      signInWithGoogle,
      signInWithMicrosoft,
    }}>
      {children}
    </AuthContext.Provider>
  );
};