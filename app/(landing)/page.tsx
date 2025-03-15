import Image from 'next/image'
import { GraduationCap, Languages, MapPin, Trophy } from 'lucide-react'

import { myWork, skills } from '@/constants/constants'
import { SocialIcons } from '@/components/social-icons'
import { ScrollToSection } from './_components/scroll-to-section'
import { Section } from './_components/section'
import { WorkCard } from './_components/work-card'
import { Badge } from '@/components/ui/badge'
import { AchievementBadge } from './_components/achievement-badge'
import { ParticlesComponent } from '@/components/particles'

const LandingPage = () => {
  return (
    <>
      <ParticlesComponent />
      <div className="md:max-w-screen-xl px-4 md:mx-auto flex flex-col items-center justify-center space-y-10 first:mt-0 relative z-10">
        <div className="h-[95vh] w-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Hi, I&apos;m ed3642dev
          </h1>
          <div className="space-y-4 sm:space-y-6">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl bg-gradient-to-r from-purple-600 to-blue-700 text-white px-2 sm:px-4 p-1 sm:p-2 rounded-md pb-2 sm:pb-4 w-fit">
              🚀 Building The Web 🚀
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl text-zinc-200">
              I&apos;m a full-stack JavaScript developer.
              <br />
              Check out the neat little projects I&apos;ve made with the navigation above, or see my
              professional work below.
            </p>
          </div>
          <div>
            <SocialIcons iconSize={36} />
          </div>
          <div>
            <ScrollToSection />
          </div>
        </div>

        <Section title="Professional Work">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myWork.map((work) => (
              <div key={work.title}>
                <WorkCard
                  title={work.title}
                  description={work.description}
                  image_path={work.image_path}
                  link={work.link || ''}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4">
            {Object.entries(skills).map(([groupTitle, groupSkills]) => (
              <div key={groupTitle} className="flex flex-col space-y-2">
                <h3 className="text-lg font-bold">
                  {groupTitle.charAt(0).toUpperCase() + groupTitle.slice(1)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupSkills.map((skill, i) => (
                    <div key={i}>
                      <Badge>{skill}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="More About Me">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center md:space-y-0 md:space-x-6">
              <div className="w-full md:w-1/3 flex justify-center">
                <Image
                  src="/media/me.webp"
                  width={200}
                  height={200}
                  alt="My Profile Pic"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-lg text-zinc-200">
                  I have been building web apps for a few years now and I&apos;m always looking to
                  learn new things and build interesting projects. Currently I&apos;m trying to get
                  more involved in the Nextjs and C# web dev communities. I would also like to build
                  an interesting company in my youth and work with talented developers.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {[
                { Icon: MapPin, title: 'ON, Canada' },
                { Icon: Trophy, title: 'Top 20% In Leetcode' },
                { Icon: GraduationCap, title: 'BS from Ontario Tech' },
                { Icon: GraduationCap, title: 'CPA from Durham College' },
                { Icon: Languages, title: 'Native Spanish' },
                { Icon: Trophy, title: 'D1 In League' },
              ].map((achievement, index) => (
                <div key={index}>
                  <AchievementBadge Icon={achievement.Icon} title={achievement.title} />
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}

export default LandingPage
