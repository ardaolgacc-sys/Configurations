import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Info, Rocket, Target, MagnifyingGlass, GridFour, ShieldCheck, Crosshair, X, ArrowLeft } from '@phosphor-icons/react'

type CampaignType = 'sp-auto' | 'sp-kt-exact' | 'sp-kt-phrase' | 'sp-kt-broad' | 'sp-pt' | 'sd-pt' | 'sp-pt-defense'

interface CampaignCondition {
  id: string
  metric: string
  timePeriod: string
  operator: string
  value: string
}

interface CampaignSettings {
  budgetPerCampaign: string
  maxTargetCount: string
  biddingStrategy: string
  bidCalculationMethod: string
  biddingAdjustment: number
  harvestingFrequency: string
  advertisedProducts: 'all' | 'include' | 'exclude'
}

const defaultCampaignSettings: CampaignSettings = {
  budgetPerCampaign: '$0.00',
  maxTargetCount: '0',
  biddingStrategy: 'down-only',
  bidCalculationMethod: 'cpc-7-days',
  biddingAdjustment: 0,
  harvestingFrequency: 'every-7-days',
  advertisedProducts: 'all'
}

interface CampaignCreationProps {
  onCreateOptimization: (section: 'campaign-creation') => void
}

const campaignTypes = [
  {
    id: 'sp-auto' as CampaignType,
    icon: Rocket,
    title: 'SP Auto',
    badge: 'Automatic',
    description: 'Automatically create sponsored product auto campaigns where Amazon targets similar keywords and products.',
    tags: ['Automatic', 'Easy Setup', 'Wide Reach']
  },
  {
    id: 'sp-kt-exact' as CampaignType,
    icon: Target,
    title: 'SP KT Exact',
    badge: 'Precise Targeting',
    description: 'Automatically harvest converted keywords and create sponsored product campaigns using exact match targeting to focus on high-performing precisely matched search terms.',
    tags: ['Precise Targeting', 'High Performance']
  },
  {
    id: 'sp-kt-phrase' as CampaignType,
    icon: MagnifyingGlass,
    title: 'SP KT Phrase',
    badge: 'Flexible Targeting',
    description: 'Automatically harvest converted keywords and create sponsored product campaigns using phrase match targeting to reach shoppers searching with relevant keyword experiences.',
    tags: ['Phrase Match', 'Flexible Targeting']
  },
  {
    id: 'sp-kt-broad' as CampaignType,
    icon: GridFour,
    title: 'SP KT Broad',
    badge: 'Discovery',
    description: 'Automatically harvest converted keywords and create sponsored product campaigns using broad match targeting to capture a wider range of related search terms and variations.',
    tags: ['Broad Match', 'Discovery']
  },
  {
    id: 'sp-pt' as CampaignType,
    icon: Crosshair,
    title: 'SP PT',
    badge: 'Product Targeting',
    description: 'Automatically harvest converted ASINs and create sponsored product targeting campaigns by leveraging those products.',
    tags: ['Product Targeting', 'Competitor Analysis']
  },
  {
    id: 'sd-pt' as CampaignType,
    icon: ShieldCheck,
    title: 'SD PT',
    badge: 'Visibility',
    description: 'Enhance brand awareness and consideration across Amazon, maximizing visibility and engagement opportunities.',
    tags: ['Visibility', 'Brand Awareness']
  },
  {
    id: 'sp-pt-defense' as CampaignType,
    icon: ShieldCheck,
    title: 'SP PT Defense',
    badge: 'Defensive',
    description: 'Defend your listings or posts, using our comprehensive selling opportunities to defend tactics.',
    tags: ['Defense', 'Competitive']
  }
]

export function CampaignCreation({ onCreateOptimization }: CampaignCreationProps) {
  const [selectedCampaignType, setSelectedCampaignType] = useKV<CampaignType | null>('selected-campaign-type', null)
  const [campaignConditions, setCampaignConditions] = useKV<CampaignCondition[]>('campaign-conditions', [])
  const [campaignSettings, setCampaignSettings] = useKV<CampaignSettings>('campaign-settings', defaultCampaignSettings)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const updateSetting = <K extends keyof CampaignSettings>(key: K, value: CampaignSettings[K]) => {
    setCampaignSettings((current) => ({ ...current!, [key]: value }))
  }

  const addCondition = () => {
    const newCondition: CampaignCondition = {
      id: `condition-${Date.now()}`,
      metric: '',
      timePeriod: '',
      operator: '',
      value: ''
    }
    setCampaignConditions((current) => [...(current || []), newCondition])
  }

  const removeCondition = (id: string) => {
    setCampaignConditions((current) => (current || []).filter(c => c.id !== id))
    toast.success('Condition removed')
  }

  const handleSave = () => {
    if (!selectedCampaignType) {
      toast.error('Please select a campaign type')
      return
    }
    toast.success('Campaign creation settings saved')
  }

  if (!campaignSettings || !campaignConditions) {
    return null
  }

  const filteredCampaigns = activeFilter === 'all' 
    ? campaignTypes 
    : campaignTypes.filter(ct => {
        if (activeFilter === 'automatic') return ct.id === 'sp-auto'
        if (activeFilter === 'performance') return ct.id === 'sp-kt-exact'
        if (activeFilter === 'sopr') return ['sp-auto', 'sp-kt-exact', 'sp-kt-phrase'].includes(ct.id)
        if (activeFilter === 'keyword') return ct.id.includes('kt')
        if (activeFilter === 'product') return ct.id.includes('pt')
        if (activeFilter === 'sponsored-product') return ct.id.startsWith('sp')
        if (activeFilter === 'sponsored-display') return ct.id.startsWith('sd')
        if (activeFilter === 'defense') return ct.id.includes('defense')
        return true
      })

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary mb-4 -ml-2"
        >
          <ArrowLeft size={16} weight="regular" className="mr-2" />
          Back to Goal Details
        </Button>
        <h2 className="text-lg font-semibold text-card-foreground mb-2">Auto Campaign Creation</h2>
        <p className="text-sm text-muted-foreground">
          Configure automated campaign creation rules based on performance metrics and conditions.
        </p>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-card-foreground mb-2">CAMPAIGN TYPE</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the campaign type you want to automatically create
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              {['All', 'Automatic', 'Performance', 'SOPR', 'Keyword', 'Product', 'Sponsored Product', 'Sponsored Display', 'Defense'].map((filter) => (
                <Badge
                  key={filter}
                  variant={activeFilter === filter.toLowerCase() ? 'default' : 'outline'}
                  className={`cursor-pointer ${activeFilter === filter.toLowerCase() ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted'}`}
                  onClick={() => setActiveFilter(filter.toLowerCase())}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCampaigns.map((campaign) => {
              const Icon = campaign.icon
              const isSelected = selectedCampaignType === campaign.id
              return (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignType(campaign.id)}
                  className={`relative text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={24} weight="regular" className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-card-foreground mb-1 flex items-center gap-2">
                    {campaign.title}
                    <Badge variant="outline" className="text-xs bg-muted/50 border-border">
                      {campaign.badge}
                    </Badge>
                  </h4>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                    {campaign.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {campaign.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs py-0 px-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-card-foreground mb-2">CONDITIONS</h3>
            <p className="text-sm text-muted-foreground">
              Define the performance rules that will trigger the creation of new targets or keywords.
            </p>
          </div>

          <div className="space-y-4">
            {(campaignConditions?.length || 0) > 0 ? (
              campaignConditions?.map((condition) => (
                <div key={condition.id} className="bg-muted/30 rounded-lg p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-card-foreground">Condition</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(condition.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} weight="regular" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-1">
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">If</Label>
                      <Select defaultValue="">
                        <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clicks">Clicks</SelectItem>
                          <SelectItem value="conversions">Conversions</SelectItem>
                          <SelectItem value="impressions">Impressions</SelectItem>
                          <SelectItem value="spend">Spend</SelectItem>
                          <SelectItem value="acos">ACoS</SelectItem>
                          <SelectItem value="roas">ROAS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="lg:col-span-4">
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">of the Search Term in the</Label>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10 flex-1">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                            <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                            <SelectItem value="last-60-days">Last 60 Days</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <span className="text-sm text-muted-foreground">is</span>
                        
                        <Select defaultValue="">
                          <SelectTrigger className="bg-input border-border text-card-foreground text-sm h-10 w-32">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="greater-than">&gt;</SelectItem>
                            <SelectItem value="less-than">&lt;</SelectItem>
                            <SelectItem value="equal-to">=</SelectItem>
                            <SelectItem value="greater-equal">≥</SelectItem>
                            <SelectItem value="less-equal">≤</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          placeholder="Value"
                          className="bg-input border-border text-card-foreground text-sm h-10 w-32"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <p className="text-sm text-muted-foreground">No conditions added yet</p>
              </div>
            )}
            
            <Button
              variant="outline"
              className="w-full border-dashed border-2 text-primary hover:text-primary hover:bg-primary/5 h-11"
              onClick={addCondition}
            >
              <Plus size={18} weight="regular" className="mr-2" />
              New Condition
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-card-foreground mb-2">CAMPAIGN SETTINGS</h3>
            <p className="text-sm text-muted-foreground">
              Set the budget, bidding strategy, and other core settings for your new campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2 block">Budget Per Campaign</Label>
              <Input
                value={campaignSettings.budgetPerCampaign}
                onChange={(e) => updateSetting('budgetPerCampaign', e.target.value)}
                className="bg-input border-border text-card-foreground"
                placeholder="$0.00"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2 block">Target Harvesting Frequency</Label>
              <Select
                value={campaignSettings.harvestingFrequency}
                onValueChange={(v) => updateSetting('harvestingFrequency', v)}
              >
                <SelectTrigger className="bg-input border-border text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every-7-days">Every 7 Days</SelectItem>
                  <SelectItem value="every-14-days">Every 14 Days</SelectItem>
                  <SelectItem value="every-30-days">Every 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2 block">Maximum Target Count</Label>
              <Input
                type="number"
                value={campaignSettings.maxTargetCount}
                onChange={(e) => updateSetting('maxTargetCount', e.target.value)}
                className="bg-input border-border text-card-foreground"
                placeholder="0"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2 block">Bidding Strategy</Label>
              <Select
                value={campaignSettings.biddingStrategy}
                onValueChange={(v) => updateSetting('biddingStrategy', v)}
              >
                <SelectTrigger className="bg-input border-border text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="down-only">Down Only</SelectItem>
                  <SelectItem value="up-and-down">Up and Down</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-card-foreground mb-2 block">Bid Calculation Method</Label>
              <Select
                value={campaignSettings.bidCalculationMethod}
                onValueChange={(v) => updateSetting('bidCalculationMethod', v)}
              >
                <SelectTrigger className="bg-input border-border text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpc-7-days">CPC - 7 Days</SelectItem>
                  <SelectItem value="cpc-14-days">CPC - 14 Days</SelectItem>
                  <SelectItem value="cpc-30-days">CPC - 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Info size={14} weight="regular" />
                <span>The bid that is calculated by the 'CPC - 7 Days' method will be used without change.</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-card-foreground mb-3 block">
                Bidding Adjustment: {(campaignSettings.biddingAdjustment || 0).toFixed(2)}%
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[campaignSettings.biddingAdjustment || 0]}
                  onValueChange={(values) => updateSetting('biddingAdjustment', values[0])}
                  min={-100}
                  max={100}
                  step={0.01}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSetting('biddingAdjustment', 0)}
                  className="text-xs h-8 px-2"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-card-foreground mb-3 block">Advertised Products</Label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateSetting('advertisedProducts', 'all')}
                  className={`flex-1 text-center p-4 rounded-lg border-2 transition-all ${
                    campaignSettings.advertisedProducts === 'all'
                      ? 'border-primary bg-primary/5 text-card-foreground font-medium'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">All Products</div>
                  <div className="text-xs opacity-75">Include all products in campaigns</div>
                </button>
                <button
                  onClick={() => updateSetting('advertisedProducts', 'include')}
                  className={`flex-1 text-center p-4 rounded-lg border-2 transition-all ${
                    campaignSettings.advertisedProducts === 'include'
                      ? 'border-primary bg-primary/5 text-card-foreground font-medium'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">Include Specific Products</div>
                  <div className="text-xs opacity-75">Choose products to advertise</div>
                </button>
                <button
                  onClick={() => updateSetting('advertisedProducts', 'exclude')}
                  className={`flex-1 text-center p-4 rounded-lg border-2 transition-all ${
                    campaignSettings.advertisedProducts === 'exclude'
                      ? 'border-primary bg-primary/5 text-card-foreground font-medium'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">Exclude Specific Products</div>
                  <div className="text-xs opacity-75">Choose products to exclude</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-6 border-t border-border mt-6">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-card-foreground"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          Save Optimization
        </Button>
      </div>
    </div>
  )
}
