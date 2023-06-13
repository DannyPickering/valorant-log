"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Provider, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'


interface UserProfile {
  is_admin: boolean
}

export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile()
  }, [user]);


  async function fetchUserProfile() {
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setUserProfile(data);
      }
    } else {
      setUserProfile(null);
    }
  }
  async function handleLoginProvider(provider: Provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    })
  }

  const handleItemClick = (route: string) => {
    router.push(route);
  }
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      router.push('/')
      router.refresh()
    }
    if (event === 'SIGNED_IN') {
      router.refresh()
    }
  })

  return (
    <header className="flex justify-between py-4 px-14 bg-primary text-primary-foreground items-center">
      <div>Valorant Tracker</div>

      {userProfile && user ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {userProfile.is_admin && (
              <>
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleItemClick(`/admin/addgames`)}>Add games</DropdownMenuItem>
              </>
            )}
            <DropdownMenuLabel className="capitalize">
              {user.user_metadata.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick(`/dashboard`)}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick(`/user/${user.user_metadata.full_name}`)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick(`/account`)}>
              Edit Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <Button className="bg-background text-primary hover:bg-rose-500 hover:text-white" onClick={() => handleLoginProvider('discord')}>
          Login with Discord
        </Button>
      )}
    </header>
  )
}
