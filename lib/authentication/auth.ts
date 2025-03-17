import NextAuth from 'next-auth'
import Twitch from 'next-auth/providers/twitch'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Twitch, GitHub],
})
