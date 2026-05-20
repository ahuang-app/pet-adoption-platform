import { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, signOut: async () => {},
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Auto-create user profile when logged in (fixes FK constraint when auth trigger fails)
  useEffect(() => {
    if (user) {
      supabase.from('users').select('id').eq('id', user.id).single().then(({ data }) => {
        if (!data) {
          supabase.from('users').insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '用户',
            email: user.email,
            phone: user.phone,
          }).then(({ error }) => {
            if (error) console.error('Failed to create user profile:', error)
          })
        }
      })
    }
  }, [user])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
