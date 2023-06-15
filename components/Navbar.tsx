"use client"

import React, { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { Button } from '@/components/ui/button'
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

export default function Navbar({ loggedInUser }: { loggedInUser: User | null }) {
  const { user, signInWithDiscord, signOut } = useAuth();
  const router = useRouter();

  console.log('user: ', user)
  const handleItemClick = (route: string) => {
    router.push(route);
  }

  return (
    <header className="flex justify-between py-4 px-14 bg-primary text-primary-foreground items-center">
      <div>Valorant Tracker</div>

      {loggedInUser ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={loggedInUser.user_metadata.avatar_url ? loggedInUser.user_metadata.avatar_url : undefined} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user != null && user.is_admin && (
              <>
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleItemClick(`/admin/add-games`)}>Add games</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleItemClick(`/admin/manage-maps`)}>Manage Maps</DropdownMenuItem>
              </>
            )}
            <DropdownMenuLabel className="capitalize">
              {loggedInUser.user_metadata.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleItemClick(`/dashboard`)}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick(`/user/${loggedInUser.user_metadata.full_name}`)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick(`/account`)}>
              Edit Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <Button className="bg-background text-primary hover:bg-rose-500 hover:text-white" onClick={signInWithDiscord}>
          Login with Discord
        </Button>
      )}
    </header>
  )
}
