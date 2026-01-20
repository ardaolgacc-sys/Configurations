import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { House, Info, Trash, CursorClick, Plus, X, CaretDown, CaretUp } from '@phosphor-icons/react'
import { AIDecisions } from '@/components/AIDecisions'
import { Dayparting } from '@/components/Dayparting'

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
  const [settings, setSettings] = useKV<StoreSettings>('store-settings', defaultSettings)
  const [dailyBiddingOptimizations, setDailyBiddingOptimizations] = useKV<Optimization[]>('daily-bidding-optimizations', DEFAULT_DAILY_BIDDING_OPTIMIZATIONS)
  const [inventoryGuardOptimizations, setInventoryGuardOptimizations] = useKV<Optimization[]>('inventory-guard-optimizations', [])
  const [campaignCreationOptimizations, setCampaignCreationOptimizations] = useKV<Optimization[]>('campaign-creation-optimizations', [])
  const [negatingOptimizations, setNegatingOptimizations] = useKV<Optimization[]>('negating-optimizations', [])
  
  const [activeTab, setActiveTab] = useState('store-settings')
  const [dailyBiddingDialogOpen, setDailyBiddingDialogOpen] = useState(false)
  const [dailyBiddingOpen, setDailyBiddingOpen] = useState(false)
  const [inventoryGuardOpen, setInventoryGuardOpen] = useState(false)
  const [campaignCreationOpen, setCampaignCreationOpen] = useState(false)
  const [negatingOpen, setNegatingOpen] = useState(false)
  const [addOptimizationPopoverOpen, setAddOptimizationPopoverOpen] = useState<string | null>(null)
  const [currentOptimizationSection, setCurrentOptimizationSection] = useState<'daily-bidding' | 'inventory-guard' | 'campaign-creation' | 'negating' | null>(null)

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

  const moveOptimizationUp = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'campaign-creation' | 'negating') => {
    if (index === 0) return
    
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'campaign-creation': return campaignCreationOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'campaign-creation': setCampaignCreationOptimizations(newOptimizations); break
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

  const moveOptimizationDown = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'campaign-creation' | 'negating') => {
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'campaign-creation': return campaignCreationOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const optimizations = getOptimizations()
    if (index === optimizations.length - 1) return
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'campaign-creation': setCampaignCreationOptimizations(newOptimizations); break
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

  const deleteOptimization = (index: number, section: 'daily-bidding' | 'inventory-guard' | 'campaign-creation' | 'negating') => {
    const getOptimizations = () => {
      switch(section) {
        case 'daily-bidding': return dailyBiddingOptimizations
        case 'inventory-guard': return inventoryGuardOptimizations || []
        case 'campaign-creation': return campaignCreationOptimizations || []
        case 'negating': return negatingOptimizations || []
      }
    }
    
    const setOptimizations = (newOptimizations: Optimization[]) => {
      switch(section) {
        case 'daily-bidding': setDailyBiddingOptimizations(newOptimizations); break
        case 'inventory-guard': setInventoryGuardOptimizations(newOptimizations); break
        case 'campaign-creation': setCampaignCreationOptimizations(newOptimizations); break
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

  const handleOptimizationTypeSelect = (type: OptimizationType, section: 'daily-bidding' | 'inventory-guard' | 'campaign-creation' | 'negating') => {
    setAddOptimizationPopoverOpen(null)
    
    if (type === 'eva-ai') {
      toast.info('Eva AI will optimize this automatically')
    } else if (type === 'dont-optimize') {
      toast.info('Optimization disabled for this section')
    } else if (type === 'custom') {
      setCurrentOptimizationSection(section)
      setDailyBiddingDialogOpen(true)
    }
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background">
        <header className="pt-6 px-8 pb-0">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-card-foreground">Configurations</h1>
            <div className="h-6 w-px bg-border"></div>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <House size={20} weight="regular" />
            </button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-8">
              <TabsTrigger 
                value="store-settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                Store Settings
              </TabsTrigger>
              <TabsTrigger 
                value="dayparting"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                Dayparting
              </TabsTrigger>
              <TabsTrigger 
                value="ai-decisions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                AI Decisions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="store-settings" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-auto">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-2">Configure Your Store Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Define your advertising strategy, set bidding parameters, and configure automated optimizations to maximize your campaign performance.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 flex flex-col gap-6 bg-card rounded-lg shadow-sm p-6 border border-border">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 1: Choose Your Focus</h3>
                          <p className="text-xs text-muted-foreground">Select your primary business objective</p>
                        </div>
                      </div>
                      <div className="bg-muted rounded-md p-4 space-y-3">
                        <RadioGroup value={settings.focusStrategy} onValueChange={(v) => updateSetting('focusStrategy', v as FocusStrategy)}>
                          <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                              <RadioGroupItem value="growth-focused" id="growth-focused" className="h-4 w-4 text-primary border-muted-foreground" />
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Growth Focused</span>
                            </label>
                            <label className={`flex items-center space-x-3 cursor-pointer group p-2 -mx-2 rounded ${settings.focusStrategy === 'lean-growth' ? 'bg-primary/10 border border-primary/30' : ''}`}>
                              <RadioGroupItem value="lean-growth" id="lean-growth" className="h-4 w-4 text-primary border-muted-foreground" />
                              <span className={`text-sm ${settings.focusStrategy === 'lean-growth' ? 'font-bold text-card-foreground' : 'font-medium text-foreground group-hover:text-primary transition-colors'}`}>Lean Growth</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                              <RadioGroupItem value="balanced" id="balanced" className="h-4 w-4 text-primary border-muted-foreground" />
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Balanced Approach</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                              <RadioGroupItem value="lean-profit" id="lean-profit" className="h-4 w-4 text-primary border-muted-foreground" />
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Lean Profit</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                              <RadioGroupItem value="profit-focused" id="profit-focused" className="h-4 w-4 text-primary border-muted-foreground" />
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Profit Focused</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 2: Set Your Target Metric</h3>
                        <p className="text-xs text-muted-foreground">Choose how to measure advertising efficiency</p>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Label className="text-sm font-medium text-card-foreground">Target Type</Label>
                        <Info size={14} weight="regular" className="text-muted-foreground cursor-help" />
                      </div>
                      <RadioGroup value={settings.targetType} onValueChange={(v) => updateSetting('targetType', v as TargetType)} className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="acos" id="acos" className="h-4 w-4" />
                          <Label htmlFor="acos" className="text-sm text-foreground cursor-pointer">ACoS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tacos" id="tacos" className="h-4 w-4" />
                          <Label htmlFor="tacos" className="text-sm text-foreground cursor-pointer">TACoS</Label>
                        </div>
                      </RadioGroup>
                      <a href="#" className="text-xs text-muted-foreground hover:text-primary underline decoration-dotted transition-colors">
                        Breakeven ACoS is 42.42%
                      </a>
                    </div>

                    <Separator className="bg-border" />

                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 3: Define Bid Boundaries</h3>
                        <p className="text-xs text-muted-foreground">Set safe minimum and maximum bid limits</p>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            <Label className="text-sm font-medium text-foreground">Min Bid</Label>
                            <Info size={16} weight="regular" className="text-muted-foreground cursor-help" />
                          </div>
                          <Input 
                            value={settings.minBid}
                            onChange={(e) => updateSetting('minBid', e.target.value)}
                            className="bg-input border-border text-card-foreground"
                          />
                          <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('minBid', '$0.11')} className="underline decoration-dotted cursor-pointer hover:text-card-foreground">$0.11</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            <Label className="text-sm font-medium text-foreground">Max Bid</Label>
                            <Info size={16} weight="regular" className="text-muted-foreground cursor-help" />
                          </div>
                          <Input 
                            value={settings.maxBid}
                            onChange={(e) => updateSetting('maxBid', e.target.value)}
                            className="bg-input border-border text-card-foreground"
                          />
                          <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('maxBid', '$5.00')} className="underline decoration-dotted cursor-pointer hover:text-card-foreground">$5.00</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1.5">
                            <Label className="text-sm font-medium text-foreground">Target ACoS</Label>
                            <Info size={16} weight="regular" className="text-muted-foreground cursor-help" />
                          </div>
                          <Input 
                            value={settings.targetAcos}
                            onChange={(e) => updateSetting('targetAcos', e.target.value)}
                            className="bg-input border-border text-card-foreground"
                          />
                          <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <span>Recommended: <button onClick={() => applyRecommendation('targetAcos', '26.25%')} className="underline decoration-dotted cursor-pointer hover:text-card-foreground">26.25%</button></span>
                            <CursorClick size={12} weight="regular" className="ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col bg-card rounded-lg shadow-sm p-6 border border-border">
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 4: Configure Automated Optimizations</h3>
                      <p className="text-xs text-muted-foreground">Enable AI-powered automation for various campaign aspects. Click any section to expand and configure.</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <Collapsible open={dailyBiddingOpen} onOpenChange={setDailyBiddingOpen}>
                        <div className="border border-border rounded-lg bg-card">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-card-foreground cursor-pointer">Daily Bid Optimizations</Label>
                              <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {dailyBiddingOptimizations.length} added
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary h-7 px-2"
                              >
                                See all
                              </Button>
                              <Popover open={addOptimizationPopoverOpen === 'daily-bidding'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'daily-bidding' : null)}>
                                <PopoverTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-accent text-primary-foreground h-7 px-3 text-xs font-semibold shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    <Plus size={14} weight="regular" className="mr-1" />
                                    Add Optimization
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" align="end" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('eva-ai', 'daily-bidding')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Optimized by Eva AI</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('dont-optimize', 'daily-bidding')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Don't Optimize</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('custom', 'daily-bidding')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Create Your Own</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <CaretDown size={20} weight="bold" className={`text-muted-foreground transition-transform ${dailyBiddingOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              <div className="border border-border rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-muted/30">
                                    <tr className="border-b border-border">
                                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                      <th className="w-12"></th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-card">
                                    {dailyBiddingOptimizations.map((opt, index) => (
                                      <tr key={opt.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors group">
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-2">
                                            <button 
                                              onClick={() => moveOptimizationUp(index, 'daily-bidding')}
                                              disabled={index === 0}
                                              className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                              <CaretUp size={14} weight="bold" />
                                            </button>
                                            <span className="text-sm font-medium text-card-foreground">{opt.id}.</span>
                                            <button 
                                              onClick={() => moveOptimizationDown(index, 'daily-bidding')}
                                              disabled={index === dailyBiddingOptimizations.length - 1}
                                              className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                              <CaretDown size={14} weight="bold" />
                                            </button>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4">
                                          <span className="text-sm text-primary font-medium">{opt.title}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                          <span className="text-sm text-foreground">{opt.action}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                          <span className="text-sm text-foreground">{opt.condition}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                          <button 
                                            onClick={() => deleteOptimization(index, 'daily-bidding')}
                                            className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                          >
                                            <Trash size={16} weight="regular" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible open={inventoryGuardOpen} onOpenChange={setInventoryGuardOpen}>
                        <div className="border border-border rounded-lg bg-card">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-card-foreground cursor-pointer">Inventory & Performance Guard</Label>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${(inventoryGuardOptimizations?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {inventoryGuardOptimizations?.length || 0} added
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary h-7 px-2"
                              >
                                See all
                              </Button>
                              <Popover open={addOptimizationPopoverOpen === 'inventory-guard'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'inventory-guard' : null)}>
                                <PopoverTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-accent text-primary-foreground h-7 px-3 text-xs font-semibold shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    <Plus size={14} weight="regular" className="mr-1" />
                                    Add Optimization
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" align="end" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('eva-ai', 'inventory-guard')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Optimized by Eva AI</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('dont-optimize', 'inventory-guard')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Don't Optimize</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('custom', 'inventory-guard')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Create Your Own</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <CaretDown size={20} weight="bold" className={`text-muted-foreground transition-transform ${inventoryGuardOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              {(inventoryGuardOptimizations?.length || 0) > 0 ? (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-muted/30">
                                      <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                        <th className="w-12"></th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-card">
                                      {inventoryGuardOptimizations?.map((opt, index) => (
                                        <tr key={opt.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors group">
                                          <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                              <button 
                                                onClick={() => moveOptimizationUp(index, 'inventory-guard')}
                                                disabled={index === 0}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretUp size={14} weight="bold" />
                                              </button>
                                              <span className="text-sm font-medium text-card-foreground">{opt.id}.</span>
                                              <button 
                                                onClick={() => moveOptimizationDown(index, 'inventory-guard')}
                                                disabled={index === (inventoryGuardOptimizations?.length || 0) - 1}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretDown size={14} weight="bold" />
                                              </button>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-primary font-medium">{opt.title}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.action}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.condition}</span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <button 
                                              onClick={() => deleteOptimization(index, 'inventory-guard')}
                                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                              <Trash size={16} weight="regular" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  No optimizations configured yet. Click "Add Optimization" to create one.
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible open={campaignCreationOpen} onOpenChange={setCampaignCreationOpen}>
                        <div className="border border-border rounded-lg bg-card">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-card-foreground cursor-pointer">Campaign Creation</Label>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${(campaignCreationOptimizations?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {campaignCreationOptimizations?.length || 0} added
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary h-7 px-2"
                              >
                                See all
                              </Button>
                              <Popover open={addOptimizationPopoverOpen === 'campaign-creation'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'campaign-creation' : null)}>
                                <PopoverTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-accent text-primary-foreground h-7 px-3 text-xs font-semibold shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    <Plus size={14} weight="regular" className="mr-1" />
                                    Add Optimization
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" align="end" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('eva-ai', 'campaign-creation')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Optimized by Eva AI</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('dont-optimize', 'campaign-creation')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Don't Optimize</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('custom', 'campaign-creation')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Create Your Own</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <CaretDown size={20} weight="bold" className={`text-muted-foreground transition-transform ${campaignCreationOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              {(campaignCreationOptimizations?.length || 0) > 0 ? (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-muted/30">
                                      <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                        <th className="w-12"></th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-card">
                                      {campaignCreationOptimizations?.map((opt, index) => (
                                        <tr key={opt.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors group">
                                          <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                              <button 
                                                onClick={() => moveOptimizationUp(index, 'campaign-creation')}
                                                disabled={index === 0}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretUp size={14} weight="bold" />
                                              </button>
                                              <span className="text-sm font-medium text-card-foreground">{opt.id}.</span>
                                              <button 
                                                onClick={() => moveOptimizationDown(index, 'campaign-creation')}
                                                disabled={index === (campaignCreationOptimizations?.length || 0) - 1}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretDown size={14} weight="bold" />
                                              </button>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-primary font-medium">{opt.title}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.action}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.condition}</span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <button 
                                              onClick={() => deleteOptimization(index, 'campaign-creation')}
                                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                              <Trash size={16} weight="regular" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  No optimizations configured yet. Click "Add Optimization" to create one.
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible open={negatingOpen} onOpenChange={setNegatingOpen}>
                        <div className="border border-border rounded-lg bg-card">
                          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-card-foreground cursor-pointer">Negation</Label>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${(negatingOptimizations?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {negatingOptimizations?.length || 0} added
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary h-7 px-2"
                              >
                                See all
                              </Button>
                              <Popover open={addOptimizationPopoverOpen === 'negating'} onOpenChange={(open) => setAddOptimizationPopoverOpen(open ? 'negating' : null)}>
                                <PopoverTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-accent text-primary-foreground h-7 px-3 text-xs font-semibold shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                  >
                                    <Plus size={14} weight="regular" className="mr-1" />
                                    Add Optimization
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-2" align="end" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('eva-ai', 'negating')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Optimized by Eva AI</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('dont-optimize', 'negating')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Don't Optimize</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                                    </button>
                                    <button
                                      onClick={() => handleOptimizationTypeSelect('custom', 'negating')}
                                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                      <div className="font-medium text-card-foreground">Create Your Own</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <CaretDown size={20} weight="bold" className={`text-muted-foreground transition-transform ${negatingOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4">
                              {(negatingOptimizations?.length || 0) > 0 ? (
                                <div className="border border-border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-muted/30">
                                      <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condition</th>
                                        <th className="w-12"></th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-card">
                                      {negatingOptimizations?.map((opt, index) => (
                                        <tr key={opt.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors group">
                                          <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                              <button 
                                                onClick={() => moveOptimizationUp(index, 'negating')}
                                                disabled={index === 0}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretUp size={14} weight="bold" />
                                              </button>
                                              <span className="text-sm font-medium text-card-foreground">{opt.id}.</span>
                                              <button 
                                                onClick={() => moveOptimizationDown(index, 'negating')}
                                                disabled={index === (negatingOptimizations?.length || 0) - 1}
                                                className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                              >
                                                <CaretDown size={14} weight="bold" />
                                              </button>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-primary font-medium">{opt.title}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.action}</span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-sm text-foreground">{opt.condition}</span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <button 
                                              onClick={() => deleteOptimization(index, 'negating')}
                                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                              <Trash size={16} weight="regular" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  No optimizations configured yet. Click "Add Optimization" to create one.
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>

                    <div className="mt-auto flex justify-end items-center gap-4 pt-6 border-t border-border">
                      <Button 
                        variant="ghost"
                        onClick={handleClear}
                        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-card-foreground"
                      >
                        <Trash size={16} weight="regular" />
                        Clear Inputs
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
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

            <TabsContent value="ai-decisions" className="mt-0">
              <main className="flex-grow p-6 lg:p-8 overflow-hidden">
                <AIDecisions />
              </main>
            </TabsContent>
          </Tabs>
        </header>
      </div>

      <Dialog open={dailyBiddingDialogOpen} onOpenChange={setDailyBiddingDialogOpen}>
        <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-hidden bg-card flex flex-col">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-xl font-semibold text-card-foreground">Custom Optimization Builder</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Create automated rules to optimize your campaign performance based on custom conditions and actions.
            </p>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="space-y-6 py-6">
              <div className="bg-muted/20 rounded-lg p-6 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-card-foreground mb-1">Name Your Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Give this optimization a descriptive name to easily identify it later.
                    </p>
                    <Input 
                      defaultValue="Daily Bid"
                      className="bg-input border-border text-card-foreground max-w-lg h-10 text-sm"
                      placeholder="e.g., Daily Bid Adjustment, Weekend Boost, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6 border border-border">
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-card-foreground mb-1">Define Conditions</h3>
                    <p className="text-sm text-muted-foreground">
                      Set the performance criteria that will trigger this optimization. You can add multiple conditions.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pl-11">
                  <div className="bg-card rounded-lg p-5 border-2 border-border shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm font-medium text-card-foreground">Condition 1</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X size={16} weight="regular" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-end">
                      <div className="lg:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Metric</Label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10">
                            <SelectValue placeholder="Select metric..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acos">ACoS</SelectItem>
                            <SelectItem value="roas">ROAS</SelectItem>
                            <SelectItem value="ctr">CTR</SelectItem>
                            <SelectItem value="impressions">Impressions</SelectItem>
                            <SelectItem value="clicks">Clicks</SelectItem>
                            <SelectItem value="conversions">Conversions</SelectItem>
                            <SelectItem value="spend">Spend</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="lg:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Time Period</Label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10">
                            <SelectValue placeholder="Select period..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                            <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                            <SelectItem value="last-60-days">Last 60 Days</SelectItem>
                            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="lg:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Comparison</Label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current-period">Current Period</SelectItem>
                            <SelectItem value="previous-period">Previous Period</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="lg:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Operator</Label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="greater-than">Greater Than (&gt;)</SelectItem>
                            <SelectItem value="less-than">Less Than (&lt;)</SelectItem>
                            <SelectItem value="equal-to">Equal To (=)</SelectItem>
                            <SelectItem value="greater-equal">Greater or Equal (≥)</SelectItem>
                            <SelectItem value="less-equal">Less or Equal (≤)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="lg:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Target Value</Label>
                        <Input 
                          className="bg-input border-border text-card-foreground text-sm h-10"
                          placeholder="e.g., 25, 3.5, 100"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full border-dashed border-2 text-primary hover:text-primary hover:bg-primary/5 h-11"
                  >
                    <Plus size={18} weight="regular" className="mr-2" />
                    Add Another Condition
                  </Button>

                  <div className="bg-accent/5 rounded-lg p-4 border border-accent/20 mt-6">
                    <div className="flex items-start gap-3">
                      <Info size={18} weight="regular" className="text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground font-medium mb-2">Cooldown Period</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm text-muted-foreground">
                            After applying this optimization, wait
                          </span>
                          <Input 
                            type="number"
                            defaultValue="3"
                            min="1"
                            className="bg-input border-border text-card-foreground w-20 h-9 text-sm"
                          />
                          <span className="text-sm text-muted-foreground">
                            days before running another optimization
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6 border border-border">
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-card-foreground mb-1">Choose Action</h3>
                    <p className="text-sm text-muted-foreground">
                      Select what action should be taken when the conditions above are met.
                    </p>
                  </div>
                </div>
                <div className="pl-11">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Action Type</Label>
                      <Select defaultValue="">
                        <SelectTrigger className="bg-input border-border text-card-foreground font-medium h-10">
                          <SelectValue placeholder="Select action to perform..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase-bid">Increase Bid</SelectItem>
                          <SelectItem value="decrease-bid">Decrease Bid</SelectItem>
                          <SelectItem value="increase-budget">Increase Budget</SelectItem>
                          <SelectItem value="decrease-budget">Decrease Budget</SelectItem>
                          <SelectItem value="pause-campaign">Pause Campaign</SelectItem>
                          <SelectItem value="enable-campaign">Enable Campaign</SelectItem>
                          <SelectItem value="send-notification">Send Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">Adjustment Amount</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number"
                          placeholder="e.g., 10"
                          className="bg-input border-border text-card-foreground h-10 text-sm"
                        />
                        <Select defaultValue="percentage">
                          <SelectTrigger className="bg-input border-border text-card-foreground h-10 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 pt-4 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info size={16} weight="regular" />
              <span>This optimization will run automatically once activated</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost"
                onClick={() => setDailyBiddingDialogOpen(false)}
                className="text-muted-foreground hover:text-card-foreground h-10 px-5"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  toast.success('Custom optimization saved successfully')
                  setDailyBiddingDialogOpen(false)
                }}
                className="bg-primary hover:bg-accent text-primary-foreground shadow-lg shadow-primary/20 h-10 px-6 font-semibold"
              >
                Save Optimization
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default App
