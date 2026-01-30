import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Info, Lightbulb, X, Plus, Check, ArrowLeft } from '@phosphor-icons/react'
import { CampaignScope } from '@/components/Onboarding'
import { toast } from 'sonner'

interface OptimizationBuilderProps {
  section: 'daily-bidding' | 'inventory-guard' | 'negating' | 'campaign-creation' | null
  scopes: CampaignScope[]
  onBack: () => void
  onSave: () => void
  onToggleScope: (id: string) => void
  onSelectAllScopes: () => void
}

export function OptimizationBuilder({ 
  section, 
  scopes, 
  onBack, 
  onSave,
  onToggleScope,
  onSelectAllScopes
}: OptimizationBuilderProps) {
  const [conditions, setConditions] = useState([{ id: '1' }])
  
  const getSectionTitle = () => {
    switch(section) {
      case 'daily-bidding': return 'Daily Bid Optimizations'
      case 'inventory-guard': return 'Inventory & Performance Guard'
      case 'negating': return 'Negation'
      case 'campaign-creation': return 'Campaign Creation'
      default: return 'Custom Optimization'
    }
  }

  const addCondition = () => {
    setConditions(current => [...current, { id: String(current.length + 1) }])
  }

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(current => current.filter(c => c.id !== id))
    }
  }

  const allScopesSelected = scopes.every(s => s.selected)
  const selectedScopesCount = scopes.filter(s => s.selected).length

  return (
    <div className="bg-muted/10 rounded-lg p-6 border border-border space-y-6 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary -ml-2 h-7 px-2 text-xs"
            >
              <ArrowLeft size={14} weight="regular" className="mr-1" />
              Back
            </Button>
            <div className="h-4 w-px bg-border"></div>
            <h3 className="text-base font-semibold text-card-foreground">
              Create Optimization for {getSectionTitle()}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground pl-[72px]">
            Configure custom rules to automatically optimize your campaign performance.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-1">Select Campaign Scope</h4>
              <p className="text-xs text-muted-foreground">
                Choose which campaign types this optimization rule should apply to.
              </p>
            </div>
            <Button
              variant={allScopesSelected ? "default" : "outline"}
              size="sm"
              onClick={onSelectAllScopes}
              className={allScopesSelected ? "bg-primary text-primary-foreground h-7 text-xs px-3" : "h-7 text-xs px-3"}
            >
              {allScopesSelected ? <Check size={12} weight="bold" className="mr-1" /> : null}
              {allScopesSelected ? 'All Selected' : 'Select All'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scopes.map((scope) => (
              <div
                key={scope.id}
                onClick={() => onToggleScope(scope.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  scope.selected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover:border-muted-foreground/30'
                }`}
              >
                <div className={`flex items-center justify-center w-4 h-4 rounded border-2 flex-shrink-0 transition-all ${
                  scope.selected 
                    ? 'border-primary bg-primary' 
                    : 'border-border bg-background'
                }`}>
                  {scope.selected && <Check size={12} weight="bold" className="text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-card-foreground truncate">{scope.category}</span>
                    {scope.type && (
                      <>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs font-medium text-primary truncate">{scope.type}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedScopesCount === 0 && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <Info size={16} weight="regular" className="text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive">Please select at least one campaign scope to continue.</p>
            </div>
          )}
        </div>

        <div className="h-px bg-border"></div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-2 block">Optimization Name</Label>
            <Input 
              defaultValue=""
              className="bg-input border-border text-card-foreground h-10 text-sm"
              placeholder="e.g., Daily Bid Adjustment, Weekend Boost, etc."
            />
          </div>
        </div>

        <div className="h-px bg-border"></div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-card-foreground mb-1">Define Conditions</h4>
              <p className="text-xs text-muted-foreground">
                Set the performance criteria that will trigger this optimization.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} weight="fill" className="text-primary" />
              <h5 className="text-xs font-semibold text-card-foreground">Quick Start Templates</h5>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Select a preset template to quickly configure common optimization scenarios.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <button className="group bg-card hover:bg-accent/10 border border-border hover:border-primary/40 rounded-md p-3 text-left transition-all">
                <div className="flex items-start justify-between mb-1.5">
                  <h6 className="text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors">High ACoS Reduction</h6>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/30">Popular</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Decrease bids when ACoS exceeds target
                </p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">ACoS &gt; Target</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">-5%</span>
                </div>
              </button>

              <button className="group bg-card hover:bg-accent/10 border border-border hover:border-primary/40 rounded-md p-3 text-left transition-all">
                <div className="flex items-start justify-between mb-1.5">
                  <h6 className="text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors">No Orders - Decrease</h6>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/30">Common</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Reduce spending with no conversions
                </p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">0 Orders</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">-20%</span>
                </div>
              </button>

              <button className="group bg-card hover:bg-accent/10 border border-border hover:border-primary/40 rounded-md p-3 text-left transition-all">
                <div className="flex items-start justify-between mb-1.5">
                  <h6 className="text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors">High Performance Boost</h6>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">Growth</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Increase bids on high-converting targets
                </p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">ACoS &lt; 20%</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">+10%</span>
                </div>
              </button>

              <button className="group bg-card hover:bg-accent/10 border border-border hover:border-primary/40 rounded-md p-3 text-left transition-all">
                <div className="flex items-start justify-between mb-1.5">
                  <h6 className="text-xs font-semibold text-card-foreground group-hover:text-primary transition-colors">Revive Stale Targets</h6>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-border">Recovery</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Boost targets with low recent activity
                </p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Clicks &lt; 10</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">+10%</span>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-card-foreground">Condition {index + 1}</span>
                  {conditions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeCondition(condition.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} weight="regular" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Metric</Label>
                    <Select defaultValue="">
                      <SelectTrigger className="bg-input border-border text-card-foreground text-xs h-9 w-full">
                        <SelectValue placeholder="Select..." />
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
                  <div>
                    <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Time Period</Label>
                    <Select defaultValue="">
                      <SelectTrigger className="bg-input border-border text-card-foreground text-xs h-9 w-full">
                        <SelectValue placeholder="Select..." />
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
                  <div>
                    <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Comparison</Label>
                    <Select defaultValue="">
                      <SelectTrigger className="bg-input border-border text-card-foreground text-xs h-9 w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current-period">Current Period</SelectItem>
                        <SelectItem value="previous-period">Previous Period</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Operator</Label>
                    <Select defaultValue="">
                      <SelectTrigger className="bg-input border-border text-card-foreground text-xs h-9 w-full">
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
                  <div>
                    <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Target Value</Label>
                    <Input 
                      className="bg-input border-border text-card-foreground text-xs h-9 w-full"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button 
              variant="outline"
              onClick={addCondition}
              className="w-full border-dashed border-2 text-primary hover:text-primary hover:bg-primary/5 h-8 text-xs"
            >
              <Plus size={14} weight="regular" className="mr-1.5" />
              Add Another Condition
            </Button>
          </div>

          <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
            <div className="flex items-start gap-3">
              <Info size={16} weight="regular" className="text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-card-foreground font-medium mb-2">Cooldown Period</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    After applying, wait
                  </span>
                  <Input 
                    type="number"
                    defaultValue="3"
                    min="1"
                    className="bg-input border-border text-card-foreground w-20 h-8 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">
                    days before running again
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border"></div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-1">Choose Action</h4>
            <p className="text-xs text-muted-foreground">
              Select what action should be taken when the conditions are met.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Action Type</Label>
              <Select defaultValue="">
                <SelectTrigger className="bg-input border-border text-card-foreground font-medium h-10 w-full text-sm">
                  <SelectValue placeholder="Select action..." />
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
              <Label className="text-[11px] font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Adjustment Amount</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  placeholder="e.g., 10"
                  className="bg-input border-border text-card-foreground h-10 text-sm flex-1"
                />
                <Select defaultValue="percentage">
                  <SelectTrigger className="bg-input border-border text-card-foreground h-10 w-24 text-sm">
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

      <div className="flex justify-between items-center gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info size={14} weight="regular" />
          <span>This optimization will run automatically once activated</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-card-foreground h-8 px-4 text-xs"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedScopesCount === 0) {
                toast.error('Please select at least one campaign scope')
                return
              }
              toast.success('Custom optimization saved successfully')
              onSave()
            }}
            disabled={selectedScopesCount === 0}
            className="bg-primary hover:bg-accent text-primary-foreground shadow-lg shadow-primary/20 h-8 px-5 font-semibold text-xs"
          >
            Save Optimization
          </Button>
        </div>
      </div>
    </div>
  )
}
