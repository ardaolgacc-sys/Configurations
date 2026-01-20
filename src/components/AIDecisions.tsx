import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ArrowsCounterClockwise, Funnel, Calendar, MagnifyingGlass, ArrowsClockwise, Info, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { toast } from 'sonner'

type DecisionStatus = 'pending' | 'applied' | 'reverted'
type DecisionCategory = 'bid' | 'status' | 'negating'

interface AIDecision {
  id: string
  goalName: string
  goalLevel: string
  optName: string
  optPeriod: string
  campaign: string
  campaignStatus: 'SP' | 'SB' | 'SD'
  adGroup: string
  adGroupStatus: 'SP' | 'SB' | 'SD'
  targetType: 'Phrase' | 'Broad' | 'Exact' | 'Keyword'
  target: string
  targetTargetType: string
  decisionDate: string
  previousBid: number
  newBid: number
  changeRatio: number
  changeAmount: number
  ruleCode: string
  costType: string
  campaignCreationDate: string
  status: DecisionStatus
}

const MOCK_DECISIONS: AIDecision[] = [
  {
    id: '1',
    goalName: '-',
    goalLevel: 'Goal Level',
    optName: 'Daily',
    optPeriod: 'Daily',
    campaign: 'Eva - SP - AI - B0018XC8G6 - KT - Performance - phrase - 250204',
    campaignStatus: 'SP',
    adGroup: 'Eva - Auto - AI - 20250204',
    adGroupStatus: 'SP',
    targetType: 'Phrase',
    target: 'Stand up steamer',
    targetTargetType: 'Keyword',
    decisionDate: '12/03/2025, 07:00 PM',
    previousBid: 2.38,
    newBid: 2.14,
    changeRatio: -10.08,
    changeAmount: -0.24,
    ruleCode: 'Fail Safe - Bid Control _Rule',
    costType: 'CPC',
    campaignCreationDate: '02/06/2025',
    status: 'pending'
  },
  {
    id: '2',
    goalName: '-',
    goalLevel: 'Goal Level',
    optName: 'Daily',
    optPeriod: 'Daily',
    campaign: 'Eva | Standing Garment Steamer | B075Y9C8BK | SPM | H4 | Performance | Phrase',
    campaignStatus: 'SP',
    adGroup: 'Eva - Auto - AI - 20250808',
    adGroupStatus: 'SP',
    targetType: 'Phrase',
    target: 'Clothes steamer standing',
    targetTargetType: 'Keyword',
    decisionDate: '12/03/2025, 07:00 PM',
    previousBid: 1.9,
    newBid: 1.81,
    changeRatio: -4.74,
    changeAmount: -0.09,
    ruleCode: 'Daily Bid - Decrease | High ACoS _Rule',
    costType: 'CPC',
    campaignCreationDate: '08/10/2025',
    status: 'pending'
  },
  {
    id: '3',
    goalName: 'Legacy Goal',
    goalLevel: 'Store',
    optName: 'Daily Bid - Decrease | High ACoS',
    optPeriod: 'Daily',
    campaign: 'Eva - SP - AI - B09NP52K35 - KT - Performance - broad - 251110 - 1',
    campaignStatus: 'SP',
    adGroup: 'Eva - Auto - AI - 20251110',
    adGroupStatus: 'SP',
    targetType: 'Broad',
    target: 'Full garment steamer',
    targetTargetType: 'Keyword',
    decisionDate: '12/02/2025, 11:00 PM',
    previousBid: 6.19,
    newBid: 5.88,
    changeRatio: -5.01,
    changeAmount: -0.31,
    ruleCode: 'Daily Bid - Decrease | High ACoS _Rule',
    costType: 'CPC',
    campaignCreationDate: '11/10/2025',
    status: 'applied'
  },
  {
    id: '4',
    goalName: 'Legacy Goal',
    goalLevel: 'Store',
    optName: 'Daily Bid - Decrease | High ACoS',
    optPeriod: 'Daily',
    campaign: 'Eva - SP - AI - B09NP52K35 - KT - Performance - broad - 241217 - 1',
    campaignStatus: 'SP',
    adGroup: 'Eva - Auto - AI - 20241217',
    adGroupStatus: 'SP',
    targetType: 'Broad',
    target: 'Clothes steamer',
    targetTargetType: 'Keyword',
    decisionDate: '12/02/2025, 11:00 PM',
    previousBid: 1.15,
    newBid: 1.09,
    changeRatio: -5.22,
    changeAmount: -0.06,
    ruleCode: 'Daily Bid - Decrease | High ACoS _Rule',
    costType: 'CPC',
    campaignCreationDate: '12/19/2024',
    status: 'pending'
  },
  {
    id: '5',
    goalName: 'Legacy Goal',
    goalLevel: 'Store',
    optName: 'Daily Bid - Decrease | High',
    optPeriod: 'Daily',
    campaign: 'Eva - SP - B0CSB1HTN5: Square Spin Mop - KT - Broad',
    campaignStatus: 'SP',
    adGroup: 'KT - Broad',
    adGroupStatus: 'SP',
    targetType: 'Broad',
    target: 'Flat mop bucket system',
    targetTargetType: 'Keyword',
    decisionDate: '12/02/2025, 11:00 PM',
    previousBid: 0.68,
    newBid: 0.65,
    changeRatio: -4.41,
    changeAmount: -0.03,
    ruleCode: 'Daily Bid - Decrease | High ACoS _Rule',
    costType: 'CPC',
    campaignCreationDate: '09/18/2025',
    status: 'pending'
  }
]

export function AIDecisions() {
  const [decisions] = useKV<AIDecision[]>('ai-decisions', MOCK_DECISIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<DecisionCategory>('bid')
  const [dateRange, setDateRange] = useState('11/25/2025 - 01/19/2026')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [selectedDecisions, setSelectedDecisions] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredDecisions = decisions?.filter(d => 
    d.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.adGroup.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const totalPages = Math.ceil(filteredDecisions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDecisions = filteredDecisions.slice(startIndex, endIndex)

  const toggleDecisionSelection = (id: string) => {
    setSelectedDecisions(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const toggleAllDecisions = () => {
    if (selectedDecisions.length === currentDecisions.length) {
      setSelectedDecisions([])
    } else {
      setSelectedDecisions(currentDecisions.map(d => d.id))
    }
  }

  const handleRevertInBulk = () => {
    toast.success(`${selectedDecisions.length} decision(s) reverted`)
    setSelectedDecisions([])
  }

  const handleRevertSingle = (id: string) => {
    toast.success('Decision reverted')
  }

  const getStatusBadge = (status: DecisionStatus) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Pending</Badge>
      case 'applied':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Applied</Badge>
      case 'reverted':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Reverted</Badge>
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Advertising AI Decisions</h2>
          <div className="flex items-center gap-3">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Funnel size={16} weight="regular" />
                  Add Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Filter By</label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select filter..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Campaign</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="rule">Rule Code</SelectItem>
                        <SelectItem value="cost-type">Cost Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Calendar size={16} weight="regular" />
              {dateRange}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass size={18} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by campaign name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-input border-border"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DecisionCategory)}>
          <div className="flex items-center justify-between border-b border-border">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger 
                value="bid"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                Bid Decisions
              </TabsTrigger>
              <TabsTrigger 
                value="status"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                Status Decisions
              </TabsTrigger>
              <TabsTrigger 
                value="negating"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:shadow-none"
              >
                Negating Decisions
              </TabsTrigger>
            </TabsList>
            
            {selectedDecisions.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRevertInBulk}
                className="h-9 gap-2 mb-3"
              >
                <ArrowsCounterClockwise size={16} weight="regular" />
                Revert in Bulk
              </Button>
            )}
          </div>

          <TabsContent value="bid" className="mt-0">
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="min-w-[1400px] mt-6">
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 w-12">
                          <Checkbox 
                            checked={selectedDecisions.length === currentDecisions.length && currentDecisions.length > 0}
                            onCheckedChange={toggleAllDecisions}
                          />
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[100px]">
                          Goal Name<br />
                          <span className="text-[10px] font-normal normal-case">Goal Level</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[100px]">
                          Opt. Name<br />
                          <span className="text-[10px] font-normal normal-case">Opt. Period</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px]">Campaign</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[150px]">Ad Group</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[100px]">Target Type</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[150px]">
                          Target<br />
                          <span className="text-[10px] font-normal normal-case">Target/Type</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]">
                          Decision<br />
                          <span className="text-[10px] font-normal normal-case">Date</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[90px]">
                          Previous<br />
                          <span className="text-[10px] font-normal normal-case">Bid</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[90px]">
                          New<br />
                          <span className="text-[10px] font-normal normal-case">Bid</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[90px]">
                          Change<br />
                          <span className="text-[10px] font-normal normal-case">Ratio</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[90px]">
                          Change<br />
                          <span className="text-[10px] font-normal normal-case">Amount</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[150px]">Rule Code</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[80px]">
                          Cost<br />
                          <span className="text-[10px] font-normal normal-case">Type</span>
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]">
                          Campaign<br />
                          <span className="text-[10px] font-normal normal-case">Creation Date</span>
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDecisions.map((decision) => (
                        <tr key={decision.id} className="border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors">
                          <td className="py-3 px-4">
                            <Checkbox 
                              checked={selectedDecisions.includes(decision.id)}
                              onCheckedChange={() => toggleDecisionSelection(decision.id)}
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-sm text-foreground">{decision.goalName}</div>
                            <div className="text-xs text-muted-foreground">{decision.goalLevel}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-sm text-foreground">{decision.optName}</div>
                            <div className="text-xs text-muted-foreground">{decision.optPeriod}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0.5">
                                {decision.campaignStatus}
                              </Badge>
                              <span className="text-sm text-foreground line-clamp-2">{decision.campaign}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0.5">
                                {decision.adGroupStatus}
                              </Badge>
                              <span className="text-sm text-foreground">{decision.adGroup}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground">{decision.targetType}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-sm text-foreground">{decision.target}</div>
                            <div className="text-xs text-muted-foreground">{decision.targetTargetType}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground whitespace-nowrap">{decision.decisionDate}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground">${decision.previousBid.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground">${decision.newBid.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-sm font-medium ${decision.changeRatio < 0 ? 'text-destructive' : 'text-primary'}`}>
                              {decision.changeRatio > 0 ? '+' : ''}{decision.changeRatio.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-sm font-medium ${decision.changeAmount < 0 ? 'text-destructive' : 'text-primary'}`}>
                              {decision.changeAmount > 0 ? '+' : ''}${decision.changeAmount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-primary font-medium">{decision.ruleCode}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground">{decision.costType}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sm text-foreground whitespace-nowrap">{decision.campaignCreationDate}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevertSingle(decision.id)}
                              className="h-8 gap-2 text-muted-foreground hover:text-primary"
                            >
                              <ArrowsCounterClockwise size={16} weight="regular" />
                              Revert
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-9 w-9 p-0"
                    >
                      <CaretLeft size={16} weight="bold" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Previous</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                    {totalPages > 3 && (
                      <>
                        <span className="text-sm text-muted-foreground">...</span>
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="h-9 w-9 p-0"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Next</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 w-9 p-0"
                    >
                      <CaretRight size={16} weight="bold" />
                    </Button>
                  </div>

                  <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                    <SelectTrigger className="w-20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No status decisions available</p>
            </div>
          </TabsContent>

          <TabsContent value="negating" className="mt-6">
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No negating decisions available</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
