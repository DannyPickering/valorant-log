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

import { Icons } from '@/components/Icons'

export default function Navbar({ loggedInUser }: { loggedInUser: User | null }) {
  const { user, signInWithDiscord, signOut } = useAuth();

  console.log('user: ', user)

  return (
    <header className="flex justify-between py-4 px-14 bg-primary text-primary-foreground items-center">
      <Link href="/">Valorant Tracker</Link>

      {loggedInUser ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={loggedInUser.user_metadata.avatar_url ? loggedInUser.user_metadata.avatar_url : undefined} alt="Profile picture" />
              <AvatarFallback className="bg-gray-300">
                <span className="sr-only">Profile picture</span>
                <Icons.user className="w-4 h-4 text-black" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user != null && user.is_admin && (
              <>
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/add-games">Add games</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/manage-maps">Manage Maps</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/manage-agents">Manage Agents</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuLabel className="capitalize">
              {loggedInUser.user_metadata.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/user/${loggedInUser.user_metadata.full_name}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">Edit Account</Link>
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
