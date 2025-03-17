import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/authentication/auth'
import { FaTwitch } from 'react-icons/fa'

function SignInTwitch() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('twitch')
      }}
    >
      <Button
        type="submit"
        className="bg-[#9146FF] hover:bg-[#7D3BEC] text-white flex items-center gap-2"
      >
        <FaTwitch className="w-4 h-4" />
        Sign in with Twitch
      </Button>
    </form>
  )
}

export { SignInTwitch }
