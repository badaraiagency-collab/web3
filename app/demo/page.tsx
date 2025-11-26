"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Sheet, BarChart3, ArrowRight, Sparkles, CheckCircle, Zap, Users, Shield, Clock, Star, TrendingUp, Award } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient leading-tight">CallSheet</span>
                <span className="text-xs text-muted-foreground -mt-1">Style Demo</span>
              </div>
            </div>
            <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground transition-colors">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Professional Design System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Beautiful & <span className="text-gradient">Professional</span> UI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Showcasing our enhanced design system with professional fonts, beautiful gradients, 
            and modern button styles that create an exceptional user experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="btn-primary text-lg px-10 py-6 h-auto text-base font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-outline text-lg px-8 py-6 h-auto text-base font-medium"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Button Showcase */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Beautiful <span className="text-gradient">Button Styles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional button designs with hover effects, gradients, and smooth animations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="card-hover p-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Primary Buttons
                </CardTitle>
                <CardDescription>
                  Main action buttons with gradient backgrounds and hover effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="btn-primary w-full">
                  Primary Action
                </Button>
                <Button className="btn-primary w-full" size="lg">
                  Large Primary
                </Button>
                <Button className="btn-primary w-full" size="sm">
                  Small Primary
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover p-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  Secondary Buttons
                </CardTitle>
                <CardDescription>
                  Supporting buttons with subtle gradients and professional styling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="btn-secondary w-full">
                  Secondary Action
                </Button>
                <Button className="btn-secondary w-full" size="lg">
                  Large Secondary
                </Button>
                <Button className="btn-secondary w-full" size="sm">
                  Small Secondary
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-hover p-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-500" />
                  Outline Buttons
                </CardTitle>
                <CardDescription>
                  Elegant outline buttons with hover state transformations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="btn-outline w-full">
                  Outline Action
                </Button>
                <Button className="btn-outline w-full" size="lg">
                  Large Outline
                </Button>
                <Button className="btn-outline w-full" size="sm">
                  Small Outline
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover p-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                  Ghost Buttons
                </CardTitle>
                <CardDescription>
                  Subtle ghost buttons for secondary actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="ghost" className="w-full">
                  Ghost Action
                </Button>
                <Button variant="ghost" className="w-full" size="lg">
                  Large Ghost
                </Button>
                <Button variant="ghost" className="w-full" size="sm">
                  Small Ghost
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="px-4 py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Professional <span className="text-gradient">Typography</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beautiful fonts and text hierarchy for optimal readability
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover text-center p-8">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Sheet className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Poppins Headings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Professional heading font with multiple weights for clear hierarchy and modern appeal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover text-center p-8">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-semibold">Inter Body Text</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Highly readable body font optimized for screens with excellent legibility at all sizes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover text-center p-8">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-chart-1/20 to-chart-1/10 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-10 w-10 text-chart-1" />
                </div>
                <CardTitle className="text-2xl font-semibold">JetBrains Mono</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Monospace font for code elements and technical content with excellent character distinction.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Beautiful <span className="text-gradient">Color Palette</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Carefully selected colors with gradients and semantic meaning
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary rounded-2xl mx-auto shadow-lg"></div>
              <div className="text-sm font-medium">Primary</div>
              <div className="text-xs text-muted-foreground">Main brand color</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-accent rounded-2xl mx-auto shadow-lg"></div>
              <div className="text-sm font-medium">Accent</div>
              <div className="text-xs text-muted-foreground">Secondary brand color</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-chart-1 rounded-2xl mx-auto shadow-lg"></div>
              <div className="text-sm font-medium">Chart 1</div>
              <div className="text-xs text-muted-foreground">Data visualization</div>
            </div>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-chart-2 rounded-2xl mx-auto shadow-lg"></div>
              <div className="text-sm font-medium">Chart 2</div>
              <div className="text-xs text-muted-foreground">Data visualization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h3 className="text-2xl font-bold text-gradient mb-4">CallSheet Design System</h3>
          <p className="text-muted-foreground mb-6">
            Professional, modern, and beautiful UI components for exceptional user experiences.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 CallSheet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
