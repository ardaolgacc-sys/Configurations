import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkle } from '@phosphor-icons/react'

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

const DEFAULT_SCOPES: CampaignScope[] = [
  {
    id: 'sp-keyword',
    category: 'Sponsored Product',
    type: 'Keyword Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: true
  },
  {
    id: 'sp-product',
    category: 'Sponsored Product',
    type: 'Product Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: true
  },
  {
    id: 'sp-auto',
    category: 'Sponsored Product',
    type: 'Auto Targeting',
    description: 'Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon.',
    selected: true
  },
  {
    id: 'sd',
    category: 'Sponsored Display',
    type: '',
    description: 'Sponsored Display can help you reach relevant shoppers by using Amazon\'s first-party audience and contextual signals.',
    selected: true
  },
  {
    id: 'sb',
    category: 'Sponsored Brand',
    type: '',
    description: 'Sponsored Brands can help customers discover your brand and products with creative ads that appear in relevant Amazon shopping results.',
    selected: true
  }
]

export function Onboarding({ open, onComplete }: OnboardingProps) {
  const [managementType, setManagementType] = useState<'eva-ai' | 'manual'>('eva-ai')

  const handleContinue = () => {
    onComplete(managementType, DEFAULT_SCOPES)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl overflow-hidden bg-card flex flex-col [&>button]:hidden">
        <DialogHeader className="pb-4 border-b border-border">
          <div>
            <DialogTitle className="text-xl font-semibold text-card-foreground">
              Welcome to Configuration Setup
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Let's get started by choosing how you want to manage your advertising campaigns.
            </p>
          </div>
        </DialogHeader>

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

        <div className="flex justify-end items-center gap-3 pt-4 border-t border-border flex-shrink-0">
          <Button 
            onClick={handleContinue}
            size="sm"
            className="bg-primary hover:bg-accent text-primary-foreground shadow-lg shadow-primary/20 px-6 h-8 text-sm"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
