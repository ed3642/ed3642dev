import { SignOut } from '@/components/auth/sign-out'
import { auth } from '@/lib/authentication/auth'
import { SignInOptions } from '@/components/auth/sign-in-options'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

async function SignInHeader() {
  const session = await auth()

  if (!session?.user)
    return (
      <>
        <p>Sign in to play</p>
        <SignInOptions />
      </>
    )

  return (
    <div className="flex items-center justify-center w-full mt-4 space-x-2">
      <Avatar>
        <AvatarImage src={session.user.image || ''} alt="User profile" />
        <AvatarFallback>{session.user.name?.[0] || '?'}</AvatarFallback>
      </Avatar>
      <p>{session.user.name}</p>
      <SignOut />
    </div>
  )
}

export { SignInHeader }
