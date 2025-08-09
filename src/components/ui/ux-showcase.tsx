import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkle, 
  TrendUp, 
  Users, 
  Target, 
  Lightning,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react'
import { GlassCard } from '@/components/ui/glass-card'
import { FloatingElement, GradientText } from '@/components/ui/effects'

interface UXShowcaseProps {
  className?: string
}

export function UXShowcase({ className }: UXShowcaseProps) {
  const features = [
    {
      icon: Sparkle,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms analyze your profile for personalized recommendations',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendUp,
      title: 'Real-Time Analytics',
      description: 'Live data scraping provides up-to-the-minute metrics and growth tracking',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Competitive Analysis',
      description: 'Benchmark against industry peers and identify growth opportunities',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lightning,
      title: 'Instant Optimization',
      description: 'Get actionable recommendations to improve your professional presence',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-8 mb-8">
        <div className="relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FloatingElement delay={0}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6">
                <Sparkle className="h-10 w-10 text-primary" />
              </div>
            </FloatingElement>
            
            <h1 className="text-4xl font-bold mb-4">
              <GradientText>Transform Your LinkedIn Presence</GradientText>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience our redesigned interface featuring beautiful glassmorphic cards, 
              smooth animations, and intuitive user interactions that make professional 
              growth analysis engaging and actionable.
            </p>
          </motion.div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* UX Improvements Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <GlassCard gradient className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Enhanced User Experience
            </h2>
            <p className="text-muted-foreground">
              Key improvements in our redesigned interface
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-foreground">Glassmorphic Design</h3>
              <p className="text-sm text-muted-foreground">
                Modern glass-like cards with backdrop blur effects for a contemporary feel
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-foreground">Smooth Animations</h3>
              <p className="text-sm text-muted-foreground">
                Framer Motion powered transitions that guide user attention naturally
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-foreground">Enhanced Typography</h3>
              <p className="text-sm text-muted-foreground">
                Inter font with improved readability and professional appearance
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Badge 
              variant="outline" 
              className="bg-white/50 text-primary border-primary/20 px-4 py-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Built for Professional Growth
            </Badge>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}