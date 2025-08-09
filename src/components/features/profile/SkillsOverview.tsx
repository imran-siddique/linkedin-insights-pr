import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain } from '@phosphor-icons/react'
import type { ProfileData } from '@/types/linkedin'

interface SkillsOverviewProps {
  profileData: ProfileData
}

export function SkillsOverview({ profileData }: SkillsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-6 w-6 mr-2" />
          Your Skills Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {profileData.skills && profileData.skills.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              No skills identified
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}