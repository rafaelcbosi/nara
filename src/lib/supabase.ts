import { createBrowserClient } from '@supabase/ssr'

let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (typeof window === 'undefined') {
    // During SSR/build, return a dummy client that won't be used
    return { auth: { signInWithPassword: async () => ({}), signOut: async () => ({}), resetPasswordForEmail: async () => ({}) } } as unknown as ReturnType<typeof createBrowserClient>
  }
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk5NjgwMCwiZXhwIjoxOTU2NTcyODAwfQ.placeholder'
    )
  }
  return _client
}
