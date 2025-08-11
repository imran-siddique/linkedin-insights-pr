interface CompensationAnalysis {
  salaryRange?: { min: number; max: number };
  medianSalary?: number;
  percentile?: number;
  skillImpact?: { name: string; impact: number }[];
  benchmarks?: { title: string; medianSalary?: number; location?: string }[];
}