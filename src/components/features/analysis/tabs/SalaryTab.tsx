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
          {/* Compensation Overview */}
          <div className="space-y-2">
            <div>
              <span className="font-medium">Estimated Salary Range:</span>
              <span className="ml-2">
                {compensationAnalysis.salaryRange
                  ? `$${compensationAnalysis.salaryRange.min.toLocaleString()} - $${compensationAnalysis.salaryRange.max.toLocaleString()}`
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">Median Salary:</span>
              <span className="ml-2">
                {compensationAnalysis.medianSalary
                  ? `$${compensationAnalysis.medianSalary.toLocaleString()}`
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">Percentile:</span>
              <span className="ml-2">
                {compensationAnalysis.percentile
                  ? `${compensationAnalysis.percentile}th`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          {/* Skill Impact Analysis */}
          {compensationAnalysis.skillImpact && compensationAnalysis.skillImpact.length > 0 ? (
            <ul className="space-y-2">
              {compensationAnalysis.skillImpact.map((skill) => (
                <li key={skill.name} className="flex justify-between">
                  <span>{skill.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {skill.impact > 0 ? '+' : ''}
                    {skill.impact}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No skill impact data available.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="benchmarks" className="mt-4">
          {/* Salary Benchmarks */}
          {compensationAnalysis.benchmarks && compensationAnalysis.benchmarks.length > 0 ? (
            <table className="min-w-full text-left border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Median Salary</th>
                  <th className="px-4 py-2 border-b">Location</th>
                </tr>
              </thead>
              <tbody>
                {compensationAnalysis.benchmarks.map((bm, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border-b">{bm.title}</td>
                    <td className="px-4 py-2 border-b">
                      {bm.medianSalary ? `$${bm.medianSalary.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b">{bm.location || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No benchmark data available.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}