import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { Plus, Trash, CaretDown, CaretUp } from '@phosphor-icons/react'

interface Optimization {
  id: string
  title: string
  action: string
  condition: string
}

interface CampaignCreationProps {
  onCreateOptimization: (section: 'campaign-creation') => void
}

export function CampaignCreation({ onCreateOptimization }: CampaignCreationProps) {
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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-2">Campaign Creation Optimizations</h2>
        <p className="text-sm text-muted-foreground">
          Configure automated rules for creating and launching new campaigns based on performance triggers.
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-card-foreground">Active Campaign Creation Rules</Label>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${(campaignCreationOptimizations?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {campaignCreationOptimizations?.length || 0} added
            </div>
          </div>
          <Popover open={addOptimizationPopoverOpen} onOpenChange={setAddOptimizationPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                className="bg-primary hover:bg-accent text-primary-foreground h-8 px-4 text-sm font-semibold shadow-sm"
              >
                <Plus size={16} weight="regular" className="mr-1" />
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
          <div className="text-center py-16 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
            No campaign creation rules configured yet. Click "Add Optimization" to create one.
          </div>
        )}
      </div>
    </div>
  )
}
