import { SocialIcons } from './social-icons'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-white p-4 flex justify-center mt-12 z-10">
      <SocialIcons />
    </footer>
  )
}

export { Footer }
