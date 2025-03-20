import { SignInTwitch } from './twitch-sign-in'
import { SignInGithub } from './github-sign-in'

function SignInOptions() {
  return (
    <div className="flex flex-col gap-2">
      <SignInTwitch />
      <SignInGithub />
    </div>
  )
}

export { SignInOptions }
