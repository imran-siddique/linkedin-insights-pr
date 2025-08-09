import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CompensationAnalysis } from '@/types/linkedin'

interface SalaryTabProps {
  compensationAnalysis: CompensationAnalysis | null
}

export function SalaryTab({ compensationAnalysis }: SalaryTabProps) {
  if (!compensationAnalysis) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No compensation analysis available. Try analyzing a profile first.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Salary & Compensation Analysis</h3>
        <p className="text-muted-foreground">
          Comprehensive compensation insights based on your skills, experience, and market data.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Market Position</TabsTrigger>
          <TabsTrigger value="skills">Skill Impact</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Compensation overview component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Skill impact analysis component to be implemented
          </div>
        </TabsContent>
        
        <TabsContent value="benchmarks" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            Salary benchmarks component to be implemented
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}