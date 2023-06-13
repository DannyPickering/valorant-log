"use client";

import { Profile } from "@/types/collections";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "./supabase-provider";
interface ContextI {
  user: Profile | null | undefined;
  error: any;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  signOut: async () => { },
  signInWithDiscord: async () => { },
});

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null | undefined>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  // Get USER
  const getUser = async () => {
    if (serverSession?.user?.id) {
      try {
        const { data: user, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", serverSession?.user?.id)
          .single();

        if (error) {
          setError(error);
        } else {
          setUser(user as Profile);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [serverSession]);

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Sign-In with Discord
  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }

      if (event === 'SIGNED_OUT') {
        router.refresh();
        setUser(null);
      } else if (event === 'SIGNED_IN') {
        await getUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    signOut,
    signInWithDiscord,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};