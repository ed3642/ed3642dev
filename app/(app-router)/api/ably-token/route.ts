import { auth } from '@/lib/authentication/auth'
import Ably from 'ably'

export async function GET() {
  const client = new Ably.Rest(process.env.ABLY_API_KEY!)

  const session = await auth()
  const userId = session?.user?.id

  // Create a token request for the client
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: `purple-win-client-${userId}`,
  })

  // Return the token request data to the client
  return Response.json(tokenRequestData)
}
