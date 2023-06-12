"use client"

import React from 'react'
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


async function handleLoginProvider(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: 'http://localhost:3000/dashboard',
    },
  })
}

export default function Navbar({ user }: { user: User | null }) {
  console.log(user);
  const router = useRouter();

  const handleItemClick = (route: string) => {
    router.push(route);
  }
  return (
    <header className="flex justify-between py-4 px-14 bg-primary text-primary-foreground items-center">
      <div>Valorant Tracker</div>

      {user ? (
        <DropdownMenu modal={true}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="capitalize">
              {user.user_metadata.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick(`/user/${user.user_metadata.full_name}`)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick(`/account`)}>
              Edit Account
            </DropdownMenuItem>
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick(`/admin/addgames`)}>Add games</DropdownMenuItem>
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
