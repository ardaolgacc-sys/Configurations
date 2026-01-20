import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, Sparkle } from '@phosphor-icons/react'

interface OnboardingProps {
  open: boolean
  onComplete: (managementType: 'eva-ai' | 'manual', selectedScopes: CampaignScope[]) => void
}

export interface CampaignScope {
  id: string
  category: string
  type: string
  description: string
  selected: boolean
}

const CAMPAIGN_SCOPES: CampaignScope[] = [
  {
    id: 'sp-keyword',
    category: 'Sponsored Product',
    type: 'Keyword Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: false
  },
  {
    id: 'sp-product',
    category: 'Sponsored Product',
    type: 'Product Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: false
  },
  {
    id: 'sp-auto',
    category: 'Sponsored Product',
    type: 'Auto Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: false
  },
  {
    id: 'sd',
    category: 'Sponsored Display',
    type: '',
    description: 'Sponsored Display can help you reach relevant shoppers by using Amazon\'s first-party audience and contextual signals.',
    selected: false
  },
  {
    id: 'sb',
    category: 'Sponsored Brand',
    type: '',
    description: 'Sponsored Brands can help customers discover your brand and products with creative ads that appear in relevant Amazon shopping results.',
    selected: false
  }
]

export function Onboarding({ open, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [managementType, setManagementType] = useState<'eva-ai' | 'manual'>('eva-ai')
  const [scopes, setScopes] = useState<CampaignScope[]>(CAMPAIGN_SCOPES)
  const [selectAll, setSelectAll] = useState(false)

  const toggleScope = (id: string) => {
    setScopes(current => 
      current.map(scope => 
        scope.id === id ? { ...scope, selected: !scope.selected } : scope
      )
    )
    setSelectAll(false)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setScopes(current => current.map(scope => ({ ...scope, selected: newSelectAll })))
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      const selectedScopes = scopes.filter(s => s.selected)
      if (selectedScopes.length === 0) {
        return
      }
      onComplete(managementType, selectedScopes)
    }
  }

  const selectedCount = scopes.filter(s => s.selected).length

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card flex flex-col [&>button]:hidden">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-card-foreground">
                {step === 1 ? 'Welcome to Configuration Setup' : 'Select Campaign Scope'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {step === 1 
                  ? 'Let\'s get started by choosing how you want to manage your advertising campaigns.'
                  : 'Choose which campaign types these configurations will apply to.'
                }
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
                {step > 1 ? <Check size={14} weight="bold" /> : '1'}
              </span>
              <div className="w-8 h-px bg-border"></div>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </span>
            </div>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <div className="flex-1 overflow-y-auto py-8 px-2">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-card-foreground">Choose Your Management Style</h3>
                <RadioGroup value={managementType} onValueChange={(v) => setManagementType(v as 'eva-ai' | 'manual')}>
                  <div className="space-y-3">
                    <label 
                      className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        managementType === 'eva-ai' 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value="eva-ai" id="eva-ai" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkle size={20} weight="fill" className="text-primary" />
                          <span className="text-base font-semibold text-card-foreground">Eva AI Management</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Let Eva AI automatically optimize all aspects of your campaigns using advanced machine learning. 
                          All optimization sections will be managed by AI, though you can override specific rules if needed.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            Recommended
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            Automated bidding
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            Smart optimization
                          </span>
                        </div>
                      </div>
                    </label>

                    <label 
                      className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        managementType === 'manual' 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value="manual" id="manual" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-semibold text-card-foreground">Manual Configuration</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Set up custom optimization rules and manage your campaigns manually. 
                          You'll have full control over bidding strategies, inventory guards, negations, and campaign creation.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            Full control
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                            Custom rules
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-6 px-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-card-foreground mb-1">Campaign Types</h3>
                  <p className="text-sm text-muted-foreground">
                    Select all campaign types that should use these settings, or choose specific ones.
                  </p>
                </div>
                <Button
                  variant={selectAll ? "default" : "outline"}
                  size="sm"
                  onClick={handleSelectAll}
                  className={selectAll ? "bg-primary text-primary-foreground" : ""}
                >
                  {selectAll ? <Check size={16} weight="bold" className="mr-1" /> : null}
                  {selectAll ? 'All Selected' : 'Select All'}
                </Button>
              </div>

              <div className="space-y-3">
                {scopes.map((scope) => (
                  <div
                    key={scope.id}
                    onClick={() => toggleScope(scope.id)}
                    className={`flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-all ${
                      scope.selected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 transition-all ${
                      scope.selected 
                        ? 'border-primary bg-primary' 
                        : 'border-border bg-background'
                    }`}>
                      {scope.selected && <Check size={14} weight="bold" className="text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-card-foreground">{scope.category}</span>
                        {scope.type && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-primary">{scope.type}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{scope.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-4 pt-4 border-t border-border flex-shrink-0">
          {step === 2 ? (
            <Button 
              variant="ghost"
              onClick={() => setStep(1)}
              className="text-muted-foreground hover:text-card-foreground"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button 
            onClick={handleContinue}
            disabled={step === 2 && selectedCount === 0}
            className="bg-primary hover:bg-accent text-primary-foreground shadow-lg shadow-primary/20 px-8"
          >
            {step === 1 ? 'Continue' : `Continue with ${selectedCount} ${selectedCount === 1 ? 'scope' : 'scopes'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
