import { Card, CardContent } from '@/components/ui/card'
import { UserNameSectionClient } from './username-section-client'

const UserNameSection = () => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-4">
        <UserNameSectionClient />
      </CardContent>
    </Card>
  )
}

export { UserNameSection }
