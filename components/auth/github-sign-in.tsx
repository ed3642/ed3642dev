import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/authentication/auth'
import { FaGithub } from 'react-icons/fa'

function SignInGithub() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('github')
      }}
    >
      <Button type="submit">
        <FaGithub className="w-4 h-4" />
        Sign in with Github
      </Button>
    </form>
  )
}

export { SignInGithub }
