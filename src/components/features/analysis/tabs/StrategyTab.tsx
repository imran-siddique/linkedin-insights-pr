import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Trophy, Brain } from '@phosphor-icons/react'

export function StrategyTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Skill-Based Content Strategy</h3>
      <p className="text-muted-foreground">
        Strategic content recommendations based on your expertise and market positioning.
      </p>
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Optimal Posting Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Tuesday - 10:00 AM</span>
                <Badge variant="default">Peak</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Wednesday - 2:00 PM</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Thursday - 9:00 AM</span>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Skill Showcase Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-primary pl-3">
                <p className="text-sm font-medium">Share Project Deep-Dives</p>
                <p className="text-xs text-muted-foreground">Showcase technical expertise with detailed case studies</p>
              </div>
              <div className="border-l-4 border-accent pl-3">
                <p className="text-sm font-medium">Industry Commentary</p>
                <p className="text-xs text-muted-foreground">Position yourself as a thought leader in your field</p>
              </div>
              <div className="border-l-4 border-secondary pl-3">
                <p className="text-sm font-medium">Learning Journey Posts</p>
                <p className="text-xs text-muted-foreground">Document skill development and continuous learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Performance by Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Technical Tutorials</span>
                <span className="text-sm font-medium">High engagement</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Career Insights</span>
                <span className="text-sm font-medium">Medium engagement</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tool Reviews</span>
                <span className="text-sm font-medium">High engagement</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Skill Monetization Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Consulting Services</span>
                <Badge variant="outline">High potential</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Online Course Creation</span>
                <Badge variant="outline">Medium potential</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Speaking Engagements</span>
                <Badge variant="outline">High potential</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}