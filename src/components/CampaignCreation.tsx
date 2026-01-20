import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Trash, CaretDown, CaretUp, Info, Package, Sparkle, X } from '@phosphor-icons/react'

interface Optimization {
  id: string
  title: string
  action: string
  condition: string
}

type ProductSelectionType = 'all-products' | 'include-specific' | 'exclude-specific'

interface CampaignSettings {
  dailyBudget: string
  harvestingFrequency: 'every-7-days' | 'every-14-days' | 'every-30-days'
  productSelection: ProductSelectionType
}

const defaultCampaignSettings: CampaignSettings = {
  dailyBudget: '$50.00',
  harvestingFrequency: 'every-14-days',
  productSelection: 'all-products'
}

interface CampaignCreationProps {
  onCreateOptimization: (section: 'campaign-creation') => void
}

export function CampaignCreation({ onCreateOptimization }: CampaignCreationProps) {
  const [campaignSettings, setCampaignSettings] = useKV<CampaignSettings>('campaign-settings', defaultCampaignSettings)
  const [campaignCreationOptimizations, setCampaignCreationOptimizations] = useKV<Optimization[]>('campaign-creation-optimizations', [])
  const [addOptimizationPopoverOpen, setAddOptimizationPopoverOpen] = useState(false)

  const moveOptimizationUp = (index: number) => {
    if (index === 0) return
    
    setCampaignCreationOptimizations((current) => {
      const newOptimizations = [...(current || [])]
      const temp = newOptimizations[index]
      newOptimizations[index] = newOptimizations[index - 1]
      newOptimizations[index - 1] = temp
      
      newOptimizations.forEach((opt, i) => {
        opt.id = String(i + 1)
      })
      
      return newOptimizations
    })
    
    toast.success('Optimization priority updated')
  }

  const moveOptimizationDown = (index: number) => {
    const optimizations = campaignCreationOptimizations || []
    if (index === optimizations.length - 1) return
    
    setCampaignCreationOptimizations((current) => {
      const newOptimizations = [...(current || [])]
      const temp = newOptimizations[index]
      newOptimizations[index] = newOptimizations[index + 1]
      newOptimizations[index + 1] = temp
      
      newOptimizations.forEach((opt, i) => {
        opt.id = String(i + 1)
      })
      
      return newOptimizations
    })
    
    toast.success('Optimization priority updated')
  }

  const deleteOptimization = (index: number) => {
    setCampaignCreationOptimizations((current) => {
      const newOptimizations = (current || []).filter((_, i) => i !== index)
      
      newOptimizations.forEach((opt, i) => {
        opt.id = String(i + 1)
      })
      
      return newOptimizations
    })
    
    toast.success('Optimization deleted')
  }

  const handleOptimizationTypeSelect = (type: 'eva-ai' | 'dont-optimize' | 'custom') => {
    setAddOptimizationPopoverOpen(false)
    
    if (type === 'eva-ai') {
      toast.info('Eva AI will optimize this automatically')
    } else if (type === 'dont-optimize') {
      toast.info('Optimization disabled for this section')
    } else if (type === 'custom') {
      onCreateOptimization('campaign-creation')
    }
  }

  const updateSetting = <K extends keyof CampaignSettings>(key: K, value: CampaignSettings[K]) => {
    setCampaignSettings((current) => ({ ...current!, [key]: value }))
  }

  const handleSaveSettings = () => {
    toast.success('Campaign creation settings saved')
  }

  if (!campaignSettings) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-2">Configure Campaign Creation</h2>
        <p className="text-sm text-muted-foreground">
          Set up budget parameters, targeting frequency, and product selection for automated campaign creation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6 bg-card rounded-lg shadow-sm p-6 border border-border">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 1: Budget & Frequency</h3>
                <p className="text-xs text-muted-foreground">Configure daily budget and targeting schedule</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Label className="text-sm font-medium text-foreground">Total Daily Budget</Label>
                  <Info size={16} weight="regular" className="text-muted-foreground cursor-help" />
                </div>
                <Input 
                  value={campaignSettings.dailyBudget}
                  onChange={(e) => updateSetting('dailyBudget', e.target.value)}
                  className="bg-input border-border text-card-foreground"
                  placeholder="$50.00"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  The total daily budget across all campaigns
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Label className="text-sm font-medium text-foreground">Target Harvesting Frequency</Label>
                  <Info size={16} weight="regular" className="text-muted-foreground cursor-help" />
                </div>
                <Select 
                  value={campaignSettings.harvestingFrequency} 
                  onValueChange={(v) => updateSetting('harvestingFrequency', v as CampaignSettings['harvestingFrequency'])}
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
                <p className="mt-1 text-xs text-muted-foreground">
                  How often to harvest and create new campaigns
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-card-foreground mb-1">Step 2: Advertised Products</h3>
              <p className="text-xs text-muted-foreground">Select which products to include in campaigns</p>
            </div>
            
            <div className="bg-muted rounded-md p-4 space-y-3">
              <RadioGroup 
                value={campaignSettings.productSelection} 
                onValueChange={(v) => updateSetting('productSelection', v as ProductSelectionType)}
              >
                <div className="space-y-3">
                  <label className={`flex items-start space-x-3 cursor-pointer group p-2 -mx-2 rounded ${campaignSettings.productSelection === 'all-products' ? 'bg-primary/10 border border-primary/30' : ''}`}>
                    <RadioGroupItem value="all-products" id="all-products" className="h-4 w-4 text-primary border-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package size={16} weight="regular" className={campaignSettings.productSelection === 'all-products' ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={`text-sm ${campaignSettings.productSelection === 'all-products' ? 'font-bold text-card-foreground' : 'font-medium text-foreground group-hover:text-primary transition-colors'}`}>
                          All Products
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        Include all available products in your catalog
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start space-x-3 cursor-pointer group p-2 -mx-2 rounded ${campaignSettings.productSelection === 'include-specific' ? 'bg-primary/10 border border-primary/30' : ''}`}>
                    <RadioGroupItem value="include-specific" id="include-specific" className="h-4 w-4 text-primary border-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Plus size={16} weight="bold" className={campaignSettings.productSelection === 'include-specific' ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={`text-sm ${campaignSettings.productSelection === 'include-specific' ? 'font-bold text-card-foreground' : 'font-medium text-foreground group-hover:text-primary transition-colors'}`}>
                          Include Specific Products
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        Choose specific products to advertise
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start space-x-3 cursor-pointer group p-2 -mx-2 rounded ${campaignSettings.productSelection === 'exclude-specific' ? 'bg-primary/10 border border-primary/30' : ''}`}>
                    <RadioGroupItem value="exclude-specific" id="exclude-specific" className="h-4 w-4 text-primary border-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <X size={16} weight="bold" className={campaignSettings.productSelection === 'exclude-specific' ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={`text-sm ${campaignSettings.productSelection === 'exclude-specific' ? 'font-bold text-card-foreground' : 'font-medium text-foreground group-hover:text-primary transition-colors'}`}>
                          Exclude Specific Products
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        Exclude certain products from campaigns
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {(campaignSettings.productSelection === 'include-specific' || campaignSettings.productSelection === 'exclude-specific') && (
              <Button
                variant="outline"
                className="w-full mt-3 border-primary/30 text-primary hover:bg-primary/5"
                size="sm"
              >
                <Package size={16} weight="regular" className="mr-2" />
                {campaignSettings.productSelection === 'include-specific' ? 'Select Products to Include' : 'Select Products to Exclude'}
              </Button>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Button 
              onClick={handleSaveSettings}
              className="w-full bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Save Settings
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-card-foreground">Campaign Creation Rules</Label>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${(campaignCreationOptimizations?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {campaignCreationOptimizations?.length || 0} added
              </div>
            </div>
            <Popover open={addOptimizationPopoverOpen} onOpenChange={setAddOptimizationPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-accent text-primary-foreground h-7 px-3 text-xs font-semibold shadow-sm"
                >
                  <Plus size={14} weight="regular" className="mr-1" />
                  Add Optimization
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div className="space-y-1">
                  <button
                    onClick={() => handleOptimizationTypeSelect('eva-ai')}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-card-foreground">Optimized by Eva AI</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Let AI handle optimization</div>
                  </button>
                  <button
                    onClick={() => handleOptimizationTypeSelect('dont-optimize')}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-card-foreground">Don't Optimize</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Disable optimization</div>
                  </button>
                  <button
                    onClick={() => handleOptimizationTypeSelect('custom')}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-card-foreground">Create Your Own</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Build custom rules</div>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
                            onClick={() => moveOptimizationUp(index)}
                            disabled={index === 0}
                            className="text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <CaretUp size={14} weight="bold" />
                          </button>
                          <span className="text-sm font-medium text-card-foreground">{opt.id}.</span>
                          <button 
                            onClick={() => moveOptimizationDown(index)}
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
                          onClick={() => deleteOptimization(index)}
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
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-16 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg w-full">
                <Sparkle size={32} weight="regular" className="mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-card-foreground mb-1">No campaign creation rules yet</p>
                <p>Click "Add Optimization" to create your first automation rule</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
