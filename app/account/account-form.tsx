'use client'

import Avatar from './avatar'
import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [discord_id, setDiscordId] = useState<string | null>(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      if (user && user.id) {
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`avatar_url, discord_id, is_admin`)
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          console.log(data)
          setAvatarUrl(data.avatar_url)
          setDiscordId(data.discord_id)
        }
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    avatar_url,
    discord_id,
  }: {
    avatar_url: string | null
    discord_id: string | null
  }) {
    try {
      setLoading(true)

      if (user && user.id) {
        let { error } = await supabase.from('profiles').upsert({
          id: user.id as string,
          avatar_url,
          discord_id,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
        alert('Profile updated!')
      }
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        uid={user?.id || ''}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ avatar_url: url, discord_id: discord_id })
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session?.user?.email} disabled />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ avatar_url, discord_id })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
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
