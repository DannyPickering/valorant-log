'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Provider } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Database } from '@/types/supabase'

export default function Login() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleLoginProvider = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      })

      if (error) {
        console.error(error)
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <>
      <h1>Use your Discord account:</h1>
      <button onClick={() => handleLoginProvider('discord')}>
        Login with Discord
      </button>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  )
}
