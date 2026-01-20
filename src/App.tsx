import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, ArrowsClockwise, Trash, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'

type FocusType = 'growth-focused' | 'lean-growth' | 'balanced' | 'lean-profit' | 'profit-focused'
type TargetType = 'acos' | 'tacos'

interface ConfigState {
  focus: FocusType
  minBid: string
  maxBid: string
  targetType: TargetType
  targetPercentage: string
  dailyBidding: string
  negation: string
  campaignCreation: string
  adStatus: string
}

const defaultConfig: ConfigState = {
  focus: 'lean-growth',
  minBid: '$0.16',
  maxBid: '$6.20',
  targetType: 'acos',
  targetPercentage: '25.00%',
  dailyBidding: 'optimized-by-eva-ai',
  negation: 'negating-medium-tolerance',
  campaignCreation: 'dont-optimize',
  adStatus: 'performance-inventory-aware'
}

function App() {
  const [config, setConfig] = useKV<ConfigState>('campaign-config', defaultConfig)
  const [activeTab, setActiveTab] = useState('store-settings')

  const currentConfig = config || defaultConfig

  const handleClearInputs = () => {
    setConfig(defaultConfig)
    toast.success('Inputs cleared to default values')
  }

  const handleSaveGoals = () => {
    toast.success('Goals saved successfully')
  }

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex text-muted-foreground hover:text-foreground transition-colors">
            <Info size={16} weight="fill" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold">Configurations</h1>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium">
            0
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto">
            <TabsTrigger 
              value="store-settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-4 py-3 text-sm"
            >
              Store Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">FOCUS</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                <div>
                  <RadioGroup 
                    value={currentConfig.focus} 
                    onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, focus: value as FocusType }))}
                    className="gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="growth-focused" id="growth-focused" />
                      <Label htmlFor="growth-focused" className="cursor-pointer font-normal">Growth Focused</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lean-growth" id="lean-growth" />
                      <Label htmlFor="lean-growth" className="cursor-pointer font-normal">Lean Growth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced" className="cursor-pointer font-normal">Balanced Approach</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lean-profit" id="lean-profit" />
                      <Label htmlFor="lean-profit" className="cursor-pointer font-normal">Lean Profit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="profit-focused" id="profit-focused" />
                      <Label htmlFor="profit-focused" className="cursor-pointer font-normal">Profit Focused</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Min Bid</Label>
                        <InfoTooltip content="Minimum bid amount for your campaigns" />
                      </div>
                      <div className="text-lg font-medium">{currentConfig.minBid}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Recommended: $0.11</span>
                        <ArrowsClockwise size={14} />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Max Bid</Label>
                        <InfoTooltip content="Maximum bid amount for your campaigns" />
                      </div>
                      <div className="text-lg font-medium">{currentConfig.maxBid}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Recommended: $5.00</span>
                        <ArrowsClockwise size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Target Type</Label>
                      <InfoTooltip content="Choose between Advertising Cost of Sales or Total Advertising Cost of Sales" />
                    </div>
                    <div className="flex items-center gap-4">
                      <RadioGroup 
                        value={currentConfig.targetType} 
                        onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, targetType: value as TargetType }))}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="acos" id="acos" />
                          <Label htmlFor="acos" className="cursor-pointer font-normal">ACoS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tacos" id="tacos" />
                          <Label htmlFor="tacos" className="cursor-pointer font-normal">TACoS</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Target ACoS</Label>
                        <InfoTooltip content="Your target Advertising Cost of Sales percentage" />
                      </div>
                      <div className="text-lg font-medium">{currentConfig.targetPercentage}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Recommended: 20.25%</span>
                        <ArrowsClockwise size={14} />
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Breakeven ACoS is 23.75%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">OPTIMIZATIONS</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="daily-bidding" className="text-sm">Daily Bidding</Label>
                    <InfoTooltip content="Configure daily bidding optimization strategy" />
                  </div>
                  <Select 
                    value={currentConfig.dailyBidding} 
                    onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, dailyBidding: value }))}
                  >
                    <SelectTrigger id="daily-bidding" className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimized-by-eva-ai">Optimized by Eva AI</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="negation" className="text-sm">Negation</Label>
                    <InfoTooltip content="Configure keyword negation settings" />
                  </div>
                  <Select 
                    value={currentConfig.negation} 
                    onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, negation: value }))}
                  >
                    <SelectTrigger id="negation" className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negating-medium-tolerance">Negating with Medium Tolerance</SelectItem>
                      <SelectItem value="negating-low-tolerance">Negating with Low Tolerance</SelectItem>
                      <SelectItem value="negating-high-tolerance">Negating with High Tolerance</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ad-status" className="text-sm">Performance & Inventory Guard</Label>
                    <InfoTooltip content="Monitor and manage ad performance and inventory status" />
                  </div>
                  <Select 
                    value={currentConfig.adStatus} 
                    onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, adStatus: value }))}
                  >
                    <SelectTrigger id="ad-status" className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance-inventory-aware">Performance & Inventory Aware (Excl. Inbounds)</SelectItem>
                      <SelectItem value="performance-only">Performance Only</SelectItem>
                      <SelectItem value="inventory-only">Inventory Only</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="campaign-creation" className="text-sm">Campaign Creation</Label>
                    <InfoTooltip content="Configure automatic campaign creation settings" />
                  </div>
                  <Select 
                    value={currentConfig.campaignCreation} 
                    onValueChange={(value) => setConfig((current = defaultConfig) => ({ ...current, campaignCreation: value }))}
                  >
                    <SelectTrigger id="campaign-creation" className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dont-optimize">Don't Optimize</SelectItem>
                      <SelectItem value="auto-create">Auto Create</SelectItem>
                      <SelectItem value="suggest-only">Suggest Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={handleClearInputs}
            className="gap-2"
          >
            <Trash size={16} />
            Clear Inputs
          </Button>
          <Button 
            onClick={handleSaveGoals}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <FloppyDisk size={16} />
            Save Goals
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App