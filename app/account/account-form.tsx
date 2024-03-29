'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<string[]>([])
  const [newAccount, setNewAccount] = useState<string>('')
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      if (user?.id) {
        let { data, error, status } = await supabase
          .from('valorant_accounts')
          .select(`name`)
          .eq('profile_id', user.id)

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          const filteredAccounts = data
            .map(obj => obj.name)
            .filter(name => name !== null) as string[];
          setAccounts(filteredAccounts)
        }
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile(accountName: string) {
    try {
      setLoading(true)

      if (user?.id) {
        console.log(accounts);

        let { error } = await supabase.from('valorant_accounts').insert({
          profile_id: user.id as string,
          name: accountName as string,
        })
        if (error) throw error
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
      getProfile()
      setNewAccount('');
    }
  }

  const handleAddAccount = async () => {
    await updateProfile(newAccount);

  }
  return (
    <div className="form-widget">
      {user && (
        <Avatar>
          <AvatarImage src={user.user_metadata.avatar_url} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}

      <div>
        {accounts.length > 0 && (
          <>
            {accounts.map((account, index) => (
              <div key={index}>{account}</div>
            ))}
          </>
        )}

        <h2>Add accounts</h2>
        <Input value={newAccount} onChange={(e) => setNewAccount(e.target.value)} />
        <Button onClick={handleAddAccount}>Add account</Button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
