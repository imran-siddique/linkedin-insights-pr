import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            LinkedIn Analytics & Growth Advisor
          </h1>
          <p className="text-lg text-muted-foreground">
            Unlock insights from your LinkedIn profile and discover opportunities for professional growth
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Your LinkedIn Profile</CardTitle>
            <CardDescription>
              Enter your LinkedIn profile URL or username to get comprehensive insights and growth recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="linkedin-url">LinkedIn Profile URL or Username</Label>
                  <Input
                    id="linkedin-url"
                    placeholder="linkedin.com/in/username or just username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button>
                    Analyze Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App