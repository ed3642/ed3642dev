import { Badge } from '@/components/ui/badge'

interface SkillsGroupProps {
  title: string
  skills: string[]
}

const SkillsGroup: React.FC<SkillsGroupProps> = ({ title, skills }) => {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <Badge key={i}>{skill}</Badge>
        ))}
      </div>
    </div>
  )
}

export { SkillsGroup }
