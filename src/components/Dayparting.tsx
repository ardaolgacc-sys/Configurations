import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'

type MetricType = 'Impression' | 'Clicks' | 'Ad Driven Sales' | 'Cost' | 'CTR' | 'CVR' | 'ACoS'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const HOURS = [
  '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
]

const generateHeatmapData = (): number[][] => {
  const data: number[][] = []
  for (let hour = 0; hour < 24; hour++) {
    const row: number[] = []
    for (let day = 0; day < 7; day++) {
      const baseValue = Math.random() * 0.4 + 0.3
      const peakBoost = (hour >= 8 && hour <= 20) ? 0.3 : 0
      const weekendPenalty = (day >= 5) ? -0.1 : 0
      row.push(Math.min(1, Math.max(0, baseValue + peakBoost + weekendPenalty)))
    }
    data.push(row)
  }
  return data
}

const getColorForValue = (value: number): string => {
  const hue = 250
  const saturation = 70
  const lightness = 25 + (value * 45)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function Dayparting() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('Impression')
  const [heatmapData] = useState(generateHeatmapData())

  const metrics: MetricType[] = ['Impression', 'Clicks', 'Ad Driven Sales', 'Cost', 'CTR', 'CVR', 'ACoS']

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-2">Dayparting Performance</h2>
        <p className="text-sm text-muted-foreground">
          Visualize your campaign performance across different times and days to optimize your bidding strategy.
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {metrics.map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric(metric)}
                  className={`h-7 px-3 text-xs ${selectedMetric === metric ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border-border'}`}
                >
                  {metric}
                </Button>
              ))}
            </div>
            <Button size="sm" className="bg-primary hover:bg-accent text-primary-foreground shadow-lg shadow-primary/20 h-8 px-4 text-xs">
              <Plus size={14} weight="regular" className="mr-1" />
              Create Rule
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))] gap-px bg-border rounded-lg overflow-hidden border border-border">
                  <div className="bg-card"></div>
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="bg-card p-3 text-center text-xs font-semibold text-muted-foreground tracking-wide"
                    >
                      {day}
                    </div>
                  ))}

                  {HOURS.map((hour, hourIndex) => (
                    <>
                      <div
                        key={`label-${hour}`}
                        className="bg-card p-3 flex items-center justify-end text-xs font-medium text-muted-foreground pr-4"
                      >
                        {hour}
                      </div>
                      {DAYS.map((day, dayIndex) => {
                        const value = heatmapData[hourIndex][dayIndex]
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className="bg-card p-1 cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:z-10 relative group"
                            style={{
                              backgroundColor: getColorForValue(value)
                            }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/10"></div>
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-24">
              <div className="sticky top-0">
                <div className="text-xs font-semibold text-muted-foreground mb-2 text-right">
                  Performance Intensity:
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-muted-foreground">High</span>
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: getColorForValue(1) }}></div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: getColorForValue(0.75) }}></div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: getColorForValue(0.5) }}></div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: getColorForValue(0.25) }}></div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-muted-foreground">Low</span>
                    <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: getColorForValue(0) }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
