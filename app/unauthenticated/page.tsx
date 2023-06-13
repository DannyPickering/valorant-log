import React from 'react'
import createClient from "@/lib/supabase-server"
import { supabase } from '@supabase/auth-ui-shared'
import { redirect } from 'next/navigation';

export default async function Unauthenticated() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/account')
  }
  return (
    <div>Please sign in to view your account.</div>
  )
}
