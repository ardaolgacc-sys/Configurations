import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { House, Info, Trash, CursorClick, Plus, X, CaretDown, CaretUp, Sparkle, Target, ChartLineUp, ShieldCheck, Lightbulb } from '@phosphor-icons/react'
import { AIDecisions } from '@/components/AIDecisions'
import { Dayparting } from '@/components/Dayparting'
import { CampaignCreation } from '@/components/CampaignCreation'
import { Onboarding, CampaignScope } from '@/components/Onboarding'
import { OptimizationBuilder } from '@/components/OptimizationBuilder'
import { ThemeToggle } from '@/components/ThemeToggle'

type OptimizationType = 'eva-ai' | 'dont-optimize' | 'custom'

interface Optimization {
  id: string
  title: string
  action: string
  condition: string
}

const DEFAULT_DAILY_BIDDING_OPTIMIZATIONS: Optimization[] = [
  {
    id: '1',
    title: 'Daily Bid - Decrease - No Order',
    action: 'Decrease the bid of the Target by 20% (r...',
    condition: 'Spend of the Target in the last 30 days ...'
  },
  {
    id: '2',
    title: 'Daily Bid - Decrease | High ACoS',
    action: 'Decrease the bid of the Target by 5% (ra...',
    condition: 'ACoS of the Target in the last 14 days i...'
  },
  {
    id: '3',
    title: 'Daily Bid - Revive',
    action: 'Increase the bid of the Target by 10% (r...',
    condition: 'Clicks of the Target in the last 14 days...'
  },
  {
    id: '4',
    title: 'Fail Safe - Bid Control',
    action: 'Decrease the bid of the Target by 10% (r...',
    condition: 'Spend of the Target in the last 14 days ...'
  }
]

type FocusStrategy = 'growth-focused' | 'lean-growth' | 'balanced' | 'lean-profit' | 'profit-focused'
type TargetType = 'acos' | 'tacos'

interface StoreSettings {
  focusStrategy: FocusStrategy
  targetType: TargetType
  minBid: string
  maxBid: string
  targetAcos: string
}

const defaultSettings: StoreSettings = {
  focusStrategy: 'lean-growth',
  targetType: 'acos',
  minBid: '$0.08',
  maxBid: '$3.00',
  targetAcos: '35.00%'
}

function App() {
  const [onboardingComplete, setOnboardingComplete] = useKV<boolean>('onboarding-complete', false)
  const [managementType, setManagementType] = useKV<'eva-ai' | 'manual'>('management-type', 'eva-ai')
  const [selectedScopes, setSelectedScopes] = useKV<CampaignScope[]>('selected-scopes', [])
  const [settings, setSettings] = useKV<StoreSettings>('store-settings', defaultSettings)
  const [dailyBiddingOptimizations, setDailyBiddingOptimizations] = useKV<Optimization[]>('daily-bidding-optimizations', DEFAULT_DAILY_BIDDING_OPTIMIZATIONS)
  const [inventoryGuardOptimizations, setInventoryGuardOptimizations] = useKV<Optimization[]>('inventory-guard-optimizations', [])
  const [negatingOptimizations, setNegatingOptimizations] = useKV<Optimization[]>('negating-optimizations', [])
  
  const [activeTab, setActiveTab] = useState('store-settings')
  const [dailyBiddingOpen, setDailyBiddingOpen] = useState(false)
  const [inventoryGuardOpen, setInventoryGuardOpen] = useState(false)
  const [negatingOpen, setNegatingOpen] = useState(false)
  const [addOptimizationPopoverOpen, setAddOptimizationPopoverOpen] = useState<string | null>(null)
  const [currentOptimizationSection, setCurrentOptimizationSection] = useState<'daily-bidding' | 'inventory-guard' | 'negating' | 'campaign-creation' | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [builderSelectedScopes, setBuilderSelectedScopes] = useState<CampaignScope[]>([])

  useEffect(() => {
    if (!onboardingComplete) {
      setShowOnboarding(true)
    }
  }, [onboardingComplete])

  const handleOnboardingComplete = (mgmtType: 'eva-ai' | 'manual', scopes: CampaignScope[]) => {
    setManagementType(mgmtType)
    setSelectedScopes(scopes)
    setOnboardingComplete(true)
    setShowOnboarding(false)
    
    if (mgmtType === 'eva-ai') {
      toast.success('Eva AI will manage your campaign optimizations')
    } else {
      toast.success('Manual configuration ready - customize your optimization rules')
    }
  }

  if (!settings || !dailyBiddingOptimizations) {
    return null
  }

  const updateSetting = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((current) => ({ ...current!, [key]: value }))
  }

  const handleClear = () => {
    setSettings(defaultSettings)
    toast.success('Inputs cleared to defaults')
  }

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  const applyRecommendation = (field: 'minBid' | 'maxBid' | 'targetAcos', value: string) => {
    updateSetting(field, value)
    toast.info(`Applied recommendation: ${value}`)
  }

  const moveOptimizationUp = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'negating') => {
    if (index === 0) return
    
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'negating': setNegatingOptimizations(newOptimizations); break
      }
    }
    
    const optimizations = getOptimizations()
    const newOptimizations = [...optimizations]
    const temp = newOptimizations[index]
    newOptimizations[index] = newOptimizations[index - 1]
    newOptimizations[index - 1] = temp
    
    newOptimizations.forEach((opt, i) => {
      opt.id = String(i + 1)
    })
    
    setOptimizations(newOptimizations)
    toast.success('Optimization priority updated')
  }

  const moveOptimizationDown = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'negating') => {
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const optimizations = getOptimizations()
    if (index === optimizations.length - 1) return
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'negating': setNegatingOptimizations(newOptimizations); break
      }
    }
    
    const newOptimizations = [...optimizations]
    const temp = newOptimizations[index]
    newOptimizations[index] = newOptimizations[index + 1]
    newOptimizations[index + 1] = temp
    
    newOptimizations.forEach((opt, i) => {
      opt.id = String(i + 1)
    })
    
    setOptimizations(newOptimizations)
    toast.success('Optimization priority updated')
  }

  const deleteOptimization = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'negating') => {
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'negating': setNegatingOptimizations(newOptimizations); break
      }
    }
    
    const optimizations = getOptimizations()
    const newOptimizations = optimizations.filter((_, i) => i !== index)
    
    newOptimizations.forEach((opt, i) => {
      opt.id = String(i + 1)
    })
    
    setOptimizations(newOptimizations)
    toast.success('Optimization deleted')
  }

  const handleOptimizationTypeSelect = (type: OptimizationType, section: 'daily-bidding' | 'inventory-guard' | 'negating') => {
    setAddOptimizationPopoverOpen(null)
    
    if (type === 'eva-ai') {
      toast.info('Eva AI will optimize this automatically')
    } else if (type === 'dont-optimize') {
      toast.info('Optimization disabled for this section')
    } else if (type === 'custom') {
      setCurrentOptimizationSection(section)
      setBuilderSelectedScopes(selectedScopes || [])
    }
  }

  const handleBackToSettings = () => {
    setCurrentOptimizationSection(null)
    setBuilderSelectedScopes([])
  }

  const toggleBuilderScope = (id: string) => {
    setBuilderSelectedScopes((current) => 
      current.map(scope => 
        scope.id === id ? { ...scope, selected: !scope.selected } : scope
      )
    )
  }

  const handleSelectAllBuilderScopes = () => {
    const allSelected = builderSelectedScopes.every(s => s.selected)
    setBuilderSelectedScopes((current) => 
      current.map(scope => ({ ...scope, selected: !allSelected }))
    )
  }

  return (
    <>
      <Onboarding open={showOnboarding} onComplete={handleOnboardingComplete} />
      
      <div className="flex flex-col h-screen bg-background">
        <header className="pt-8 px-8 pb-0 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Configurations</h1>
              <div className="h-6 w-px bg-border"></div>
              <button className="text-muted-foreground hover:text-primary transition-all hover:scale-110 p-1.5 rounded-lg hover:bg-primary/5">
                <House size={18} weight="regular" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {onboardingComplete && (
                <>
                  {managementType === 'eva-ai' && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold px-3 py-1 text-xs shadow-sm">
                      <Sparkle size={14} weight="fill" className="mr-1.5" />
                      Eva AI Managed
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 px-3 py-1 text-xs font-medium shadow-sm">
                    {selectedScopes?.length || 0} {(selectedScopes?.length || 0) === 1 ? 'Scope' : 'Scopes'} Active
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowOnboarding(true)}
                    className="text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all h-7 px-2.5"
                  >
                    Edit Configuration
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 rounded-none h-auto p-0 gap-6">
              <TabsTrigger 
                value="store-settings"
                className="rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-2 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:shadow-none hover:text-foreground/80 transition-all relative group"
              >
                <span className="relative z-10">Store Settings</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="dayparting"
                className="rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-2 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:shadow-none hover:text-foreground/80 transition-all relative group"
              >
                <span className="relative z-10">Dayparting</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="campaign-creation"
                className="rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-2 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:shadow-none hover:text-foreground/80 transition-all relative group"
              >
                <span className="relative z-10">Campaign Creation</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-decisions"
                className="rounded-none border-b-3 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-2 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:shadow-none hover:text-foreground/80 transition-all relative group"
              >
                <span className="relative z-10">AI Decisions</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="store-settings" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-auto">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground mb-2">Configure Your Store Settings</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Define your advertising strategy, set bidding parameters, and configure automated optimizations to maximize your campaign performance.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                  <Target size={16} weight="bold" className="text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-foreground">Step 1: Choose Your Focus</h3>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">Select your primary business objective</p>
                            </div>
                          </div>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-2.5 border border-border/50">
                        <RadioGroup value={settings.focusStrategy} onValueChange={(v) => updateSetting('focusStrategy', v as FocusStrategy)}>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2.5 cursor-pointer group p-2 rounded-lg hover:bg-background/50 transition-all">
                              <RadioGroupItem value="growth-focused" id="growth-focused" className="h-3.5 w-3.5 text-primary border-border" />
                              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Growth Focused</span>
                            </label>
                            <label className={`flex items-center space-x-2.5 cursor-pointer group p-2 rounded-lg transition-all ${settings.focusStrategy === 'lean-growth' ? 'bg-primary/15 border-2 border-primary shadow-sm' : 'hover:bg-background/50'}`}>
                              <RadioGroupItem value="lean-growth" id="lean-growth" className="h-3.5 w-3.5 text-primary border-border" />
                              <span className={`text-xs ${settings.focusStrategy === 'lean-growth' ? 'font-bold text-foreground' : 'font-medium text-foreground group-hover:text-primary transition-colors'}`}>Lean Growth</span>
                            </label>
                            <label className="flex items-center space-x-2.5 cursor-pointer group p-2 rounded-lg hover:bg-background/50 transition-all">
                              <RadioGroupItem value="balanced" id="balanced" className="h-3.5 w-3.5 text-primary border-border" />
                              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Balanced Approach</span>
                            </label>
                            <label className="flex items-center space-x-2.5 cursor-pointer group p-2 rounded-lg hover:bg-background/50 transition-all">
                              <RadioGroupItem value="lean-profit" id="lean-profit" className="h-3.5 w-3.5 text-primary border-border" />
                              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Lean Profit</span>
                            </label>
                            <label className="flex items-center space-x-2.5 cursor-pointer group p-2 rounded-lg hover:bg-background/50 transition-all">
                              <RadioGroupItem value="profit-focused" id="profit-focused" className="h-3.5 w-3.5 text-primary border-border" />
                              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">Profit Focused</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <ChartLineUp size={16} weight="bold" className="text-primary" />
                          </div>
                          <h3 className="text-sm font-bold text-foreground">Step 2: Set Your Target Metric</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">Choose how to measure advertising efficiency</p>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="text-xs font-semibold text-foreground">Target Type</Label>
                        <Info size={14} weight="regular" className="text-muted-foreground cursor-help hover:text-primary transition-colors" />
                      </div>
                      <RadioGroup value={settings.targetType} onValueChange={(v) => updateSetting('targetType', v as TargetType)} className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="acos" id="acos" className="h-3.5 w-3.5" />
                          <Label htmlFor="acos" className="text-xs font-medium text-foreground cursor-pointer">ACoS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tacos" id="tacos" className="h-3.5 w-3.5" />
                          <Label htmlFor="tacos" className="text-xs font-medium text-foreground cursor-pointer">TACoS</Label>
                        </div>
                      </RadioGroup>
                      <a href="#" className="text-xs text-accent hover:text-primary underline decoration-dotted transition-colors inline-flex items-center gap-1">
                        Breakeven ACoS is 42.42%
                      </a>
                    </div>

                    <Separator className="bg-border" />

                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <ShieldCheck size={16} weight="bold" className="text-primary" />
                          </div>
                          <h3 className="text-sm font-bold text-foreground">Step 3: Define Bid Boundaries</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">Set safe minimum and maximum bid limits</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Label className="text-xs font-semibold text-foreground">Min Bid</Label>
                            <Info size={14} weight="regular" className="text-muted-foreground cursor-help hover:text-primary transition-colors" />
                          </div>
                          <Input 
                            value={settings.minBid}
                            onChange={(e) => updateSetting('minBid', e.target.value)}
                            className="bg-background border-border text-foreground hover:border-primary/50 focus:border-primary transition-all h-9 text-sm font-medium"
                          />
                          <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('minBid', '$0.11')} className="underline decoration-dotted cursor-pointer hover:text-primary transition-colors font-medium">$0.11</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Label className="text-xs font-semibold text-foreground">Max Bid</Label>
                            <Info size={14} weight="regular" className="text-muted-foreground cursor-help hover:text-primary transition-colors" />
                          </div>
                          <Input 
                            value={settings.maxBid}
                            onChange={(e) => updateSetting('maxBid', e.target.value)}
                            className="bg-background border-border text-foreground hover:border-primary/50 focus:border-primary transition-all h-9 text-sm font-medium"
                          />
                          <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('maxBid', '$5.00')} className="underline decoration-dotted cursor-pointer hover:text-primary transition-colors font-medium">$5.00</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Label className="text-xs font-semibold text-foreground">Target ACoS</Label>
                            <Info size={14} weight="regular" className="text-muted-foreground cursor-help hover:text-primary transition-colors" />
                          </div>
                          <Input 
                            value={settings.targetAcos}
                            onChange={(e) => updateSetting('targetAcos', e.target.value)}
                            className="bg-background border-border text-foreground hover:border-primary/50 focus:border-primary transition-all h-9 text-sm font-medium"
                          />
                          <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('targetAcos', '26.25%')} className="underline decoration-dotted cursor-pointer hover:text-primary transition-colors font-medium">26.25%</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-xl p-5 border border-primary/30 shadow-md">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="p-1.5 rounded-lg bg-primary/20">
                          <Sparkle size={16} weight="fill" className="text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">Strategy Impact Preview</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                        Based on your selections, here's what to expect:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-0.5">Bid Adjustment Range</p>
                            <p className="text-xs text-muted-foreground">$0.08 - $3.00 (62.5x spread)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-0.5">Expected ACoS Performance</p>
                            <p className="text-xs text-muted-foreground">Target: 35% · Breakeven: 42.42%</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-0.5">Growth vs Profit Balance</p>
                            <p className="text-xs text-muted-foreground">Lean Growth: Moderate spend, quality focus</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Optimization Rules Active</span>
                          <span className="text-xl font-bold text-primary">{dailyBiddingOptimizations.length + (negatingOptimizations?.length || 0) + (inventoryGuardOptimizations?.length || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col bg-card rounded-xl border border-border shadow-sm p-6">
                    <div className="grid grid-cols-3 gap-5 mb-6 pb-6 border-b border-border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1.5">{dailyBiddingOptimizations.length + (negatingOptimizations?.length || 0) + (inventoryGuardOptimizations?.length || 0)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Rules</div>
                      </div>
                      <div className="text-center border-l border-r border-border">
                        <div className="text-2xl font-bold text-accent mb-1.5">{settings.targetAcos}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Target ACoS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1.5">{settings.focusStrategy.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Strategy</div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2.5 mb-2">
                        <h3 className="text-sm font-bold text-foreground">Step 4: Configure Automated Optimizations</h3>
                        {managementType === 'eva-ai' && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold px-2.5 py-1">
                            <Sparkle size={12} weight="fill" className="mr-1" />
                            Eva AI Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {managementType === 'eva-ai' 
                          ? 'Eva AI is managing these optimizations automatically. You can override specific sections by adding custom rules.'
                          : 'Enable AI-powered automation for various campaign aspects. Click any section to expand and configure.'
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <Collapsible open={dailyBiddingOpen || currentOptimizationSection === 'daily-bidding'} onOpenChange={setDailyBiddingOpen}>
                        <div className="border border-border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-all">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-bold text-foreground cursor-pointer">Daily Bid Optimizations</Label>
                              <div className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 shadow-sm">
                                {dailyBiddingOptimizations.length} added
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {currentOptimizationSection !== 'daily-bidding' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 h-6 px-2 font-medium"
                                  >
                                    See all
                                  </Button>
                                  <Popover open={addOptimizationPopoverOpen === 'daily-bidding'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'daily-bidding' : null)}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-primary hover:bg-accent text-primary-foreground h-6 px-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                      >
                                        <Plus size={12} weight="bold" className="mr-1" />
                                        Add Optimization
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-3 bg-card border-border shadow-xl" align="end" onClick={(e) => e.stopPropagation()}>
                                      <div className="space-y-2">
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('eva-ai', 'daily-bidding')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Optimized by Eva AI</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('dont-optimize', 'daily-bidding')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Don't Optimize</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('custom', 'daily-bidding')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Create Your Own</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                        </button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              )}
                              <CaretDown size={18} weight="bold" className={`text-muted-foreground transition-transform ${(dailyBiddingOpen || currentOptimizationSection === 'daily-bidding') ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-3 pb-3 space-y-3">
                              {currentOptimizationSection === 'daily-bidding' ? (
                                <OptimizationBuilder
                                  section="daily-bidding"
                                  scopes={builderSelectedScopes}
                                  onBack={handleBackToSettings}
                                  onSave={handleBackToSettings}
                                  onToggleScope={toggleBuilderScope}
                                  onSelectAllScopes={handleSelectAllBuilderScopes}
                                />
                              ) : (
                                <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
                                  <table className="w-full">
                                    <thead className="bg-muted/50">
                                      <tr className="border-b border-border/50">
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                        <th className="w-10"></th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-card/30">
                                      {dailyBiddingOptimizations.map((opt, index) => (
                                        <tr key={opt.id} className="border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors group">
                                          <td className="py-2 px-3">
                                            <div className="flex items-center gap-1.5">
                                              <button 
                                                onClick={() => moveOptimizationUp(index, 'daily-bidding')}
                                                disabled={index === 0}
                                                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretUp size={12} weight="bold" />
                                              </button>
                                              <span className="text-xs font-medium text-foreground">{opt.id}.</span>
                                              <button 
                                                onClick={() => moveOptimizationDown(index, 'daily-bidding')}
                                                disabled={index === dailyBiddingOptimizations.length - 1}
                                                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretDown size={12} weight="bold" />
                                              </button>
                                            </div>
                                          </td>
                                          <td className="py-2 px-3">
                                            <span className="text-xs text-primary font-medium">{opt.title}</span>
                                          </td>
                                          <td className="py-2 px-3">
                                            <span className="text-xs text-foreground">{opt.action}</span>
                                          </td>
                                          <td className="py-2 px-3">
                                            <span className="text-xs text-foreground">{opt.condition}</span>
                                          </td>
                                          <td className="py-2 px-3 text-right">
                                            <button 
                                              onClick={() => deleteOptimization(index, 'daily-bidding')}
                                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                              <Trash size={14} weight="regular" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible open={negatingOpen || currentOptimizationSection === 'negating'} onOpenChange={setNegatingOpen}>
                        <div className="border border-border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-all">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-bold text-foreground cursor-pointer">Negation</Label>
                              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${(negatingOptimizations?.length || 0) > 0 ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted/50 text-muted-foreground border-border'}`}>
                                {negatingOptimizations?.length || 0} added
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {currentOptimizationSection !== 'negating' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 h-6 px-2 font-medium"
                                  >
                                    See all
                                  </Button>
                                  <Popover open={addOptimizationPopoverOpen === 'negating'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'negating' : null)}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-primary hover:bg-accent text-primary-foreground h-6 px-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                      >
                                        <Plus size={12} weight="bold" className="mr-1" />
                                        Add Optimization
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-3 bg-card border-border shadow-xl" align="end" onClick={(e) => e.stopPropagation()}>
                                      <div className="space-y-2">
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('eva-ai', 'negating')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Optimized by Eva AI</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('dont-optimize', 'negating')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Don't Optimize</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('custom', 'negating')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Create Your Own</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                        </button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              )}
                              <CaretDown size={18} weight="bold" className={`text-muted-foreground transition-transform ${(negatingOpen || currentOptimizationSection === 'negating') ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-3 pb-3 space-y-3">
                              {currentOptimizationSection === 'negating' ? (
                                <OptimizationBuilder
                                  section="negating"
                                  scopes={builderSelectedScopes}
                                  onBack={handleBackToSettings}
                                  onSave={handleBackToSettings}
                                  onToggleScope={toggleBuilderScope}
                                  onSelectAllScopes={handleSelectAllBuilderScopes}
                                />
                              ) : (
                                <>
                                  {(negatingOptimizations?.length || 0) > 0 ? (
                                    <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
                                      <table className="w-full">
                                        <thead className="bg-muted/50">
                                          <tr className="border-b border-border/50">
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                            <th className="w-10"></th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-card/30">
                                          {negatingOptimizations?.map((opt, index) => (
                                            <tr key={opt.id} className="border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors group">
                                              <td className="py-2 px-3">
                                                <div className="flex items-center gap-1.5">
                                                  <button 
                                                    onClick={() => moveOptimizationUp(index, 'negating')}
                                                    disabled={index === 0}
                                                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                  >
                                                    <CaretUp size={12} weight="bold" />
                                                  </button>
                                                  <span className="text-xs font-medium text-foreground">{opt.id}.</span>
                                                  <button 
                                                    onClick={() => moveOptimizationDown(index, 'negating')}
                                                    disabled={index === (negatingOptimizations?.length || 0) - 1}
                                                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                  >
                                                    <CaretDown size={12} weight="bold" />
                                                  </button>
                                                </div>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-primary font-medium">{opt.title}</span>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-foreground">{opt.action}</span>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-foreground">{opt.condition}</span>
                                              </td>
                                              <td className="py-2 px-3 text-right">
                                                <button 
                                                  onClick={() => deleteOptimization(index, 'negating')}
                                                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                  <Trash size={14} weight="regular" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 text-xs text-muted-foreground">
                                      No optimizations configured yet. Click "Add Optimization" to create one.
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible open={inventoryGuardOpen || currentOptimizationSection === 'inventory-guard'} onOpenChange={setInventoryGuardOpen}>
                        <div className="border border-border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-all">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-bold text-foreground cursor-pointer">Inventory & Performance Guard</Label>
                              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${(inventoryGuardOptimizations?.length || 0) > 0 ? 'bg-primary/20 text-primary border-primary/30' : 'bg-muted/50 text-muted-foreground border-border'}`}>
                                {inventoryGuardOptimizations?.length || 0} added
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {currentOptimizationSection !== 'inventory-guard' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 h-6 px-2 font-medium"
                                  >
                                    See all
                                  </Button>
                                  <Popover open={addOptimizationPopoverOpen === 'inventory-guard'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'inventory-guard' : null)}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="bg-primary hover:bg-accent text-primary-foreground h-6 px-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                        }}
                                      >
                                        <Plus size={12} weight="bold" className="mr-1" />
                                        Add Optimization
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-3 bg-card border-border shadow-xl" align="end" onClick={(e) => e.stopPropagation()}>
                                      <div className="space-y-2">
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('eva-ai', 'inventory-guard')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Optimized by Eva AI</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('dont-optimize', 'inventory-guard')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Don't Optimize</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                        </button>
                                        <button
                                          onClick={() => handleOptimizationTypeSelect('custom', 'inventory-guard')}
                                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 transition-all group"
                                        >
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs">Create Your Own</div>
                                          <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                        </button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              )}
                              <CaretDown size={18} weight="bold" className={`text-muted-foreground transition-transform ${(inventoryGuardOpen || currentOptimizationSection === 'inventory-guard') ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-3 pb-3 space-y-3">
                              {currentOptimizationSection === 'inventory-guard' ? (
                                <OptimizationBuilder
                                  section="inventory-guard"
                                  scopes={builderSelectedScopes}
                                  onBack={handleBackToSettings}
                                  onSave={handleBackToSettings}
                                  onToggleScope={toggleBuilderScope}
                                  onSelectAllScopes={handleSelectAllBuilderScopes}
                                />
                              ) : (
                                <>
                                  {(inventoryGuardOptimizations?.length || 0) > 0 ? (
                                    <div className="border border-border/30 rounded-lg overflow-hidden bg-background/50">
                                      <table className="w-full">
                                        <thead className="bg-muted/50">
                                          <tr className="border-b border-border/50">
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                            <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                            <th className="w-10"></th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-card/30">
                                          {inventoryGuardOptimizations?.map((opt, index) => (
                                            <tr key={opt.id} className="border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors group">
                                              <td className="py-2 px-3">
                                                <div className="flex items-center gap-1.5">
                                                  <button 
                                                    onClick={() => moveOptimizationUp(index, 'inventory-guard')}
                                                    disabled={index === 0}
                                                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                  >
                                                    <CaretUp size={12} weight="bold" />
                                                  </button>
                                                  <span className="text-xs font-medium text-foreground">{opt.id}.</span>
                                                  <button 
                                                    onClick={() => moveOptimizationDown(index, 'inventory-guard')}
                                                    disabled={index === (inventoryGuardOptimizations?.length || 0) - 1}
                                                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                  >
                                                    <CaretDown size={12} weight="bold" />
                                                  </button>
                                                </div>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-primary font-medium">{opt.title}</span>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-foreground">{opt.action}</span>
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className="text-xs text-foreground">{opt.condition}</span>
                                              </td>
                                              <td className="py-2 px-3 text-right">
                                                <button 
                                                  onClick={() => deleteOptimization(index, 'inventory-guard')}
                                                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                  <Trash size={14} weight="regular" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 text-xs text-muted-foreground">
                                      No optimizations configured yet. Click "Add Optimization" to create one.
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-1.5 rounded-lg bg-primary/20">
                            <ChartLineUp size={16} weight="bold" className="text-primary" />
                          </div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Performance Insight</h4>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-1.5 font-medium">
                          Campaigns with automated bid optimizations see an average <span className="font-bold text-primary">23% improvement</span> in ROAS within 30 days.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Configure at least 3 optimization rules for optimal results.
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-5 border border-accent/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-1.5 rounded-lg bg-accent/20">
                            <Lightbulb size={16} weight="bold" className="text-accent" />
                          </div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Pro Tip</h4>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-1.5 font-medium">
                          Start with Eva AI management to gather performance data, then add custom rules to fine-tune specific scenarios.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This hybrid approach maximizes both automation and control.
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end items-center gap-3 pt-6 border-t border-border">
                      <Button 
                        variant="outline"
                        onClick={handleClear}
                        className="flex items-center gap-2 h-8 px-3 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                      >
                        <Trash size={14} weight="regular" />
                        Clear Inputs
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="bg-primary hover:bg-accent text-primary-foreground h-8 px-5 text-xs font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all active:scale-95"
                      >
                        Save Goals
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            </TabsContent>

            <TabsContent value="dayparting" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-auto">
                <Dayparting />
              </main>
            </TabsContent>

            <TabsContent value="campaign-creation" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-auto">
                <CampaignCreation onCreateOptimization={(section) => {
                  setCurrentOptimizationSection(section)
                  setActiveTab('store-settings')
                }} />
              </main>
            </TabsContent>

            <TabsContent value="ai-decisions" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-hidden">
                <AIDecisions />
              </main>
            </TabsContent>
          </Tabs>
        </header>
      </div>
    </>
  )
}

export default App
