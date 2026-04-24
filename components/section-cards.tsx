"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

type Trend = {
  percent: string
  direction: "up" | "down" | "neutral"
}

function getTrend(current: number, previous: number, invert = false): Trend {
  if (previous === 0) {
    return { percent: "0.0", direction: "neutral" }
  }

  let change = ((current - previous) / previous) * 100
  if (invert) change = -change

  const percent = Math.abs(change)

  let direction: "up" | "down" | "neutral" =
    percent < 0.05 ? "neutral" : change > 0 ? "up" : "down"

  return {
    percent: percent.toFixed(1),
    direction,
  }
}

function getFooterText(
  label: string,
  trend: Trend,
  options?: { invert?: boolean }
) {
  const effectiveDirection =
    options?.invert
      ? trend.direction === "up"
        ? "down"
        : trend.direction === "down"
        ? "up"
        : "neutral"
      : trend.direction

  if (effectiveDirection === "neutral") {
    return `${label} remained stable`
  }

  const directionText =
    effectiveDirection === "up" ? "increased" : "decreased"

  return `${label} ${directionText} by ${trend.percent}%`
}

export function SectionCards({
  totalIncidents,
  currentTotalIncidents,
  totalOpenIncidents,
  currentSLACompliance,
  currentAvgResolutionTime,
  prevTotalIncidents,
  prevTotalOpenIncidents,
  prevSLACompliance,
  prevAvgResolutionTime,
  currentOpenIncidents,
  SLACompliance,
  avgResolutionTime,
}: {
  currentTotalIncidents: number
  totalOpenIncidents: number
  currentSLACompliance: number
  currentAvgResolutionTime: number
  prevTotalIncidents: number
  prevTotalOpenIncidents: number
  prevSLACompliance: number
  prevAvgResolutionTime: number
  totalIncidents: number
  currentOpenIncidents: number
  SLACompliance: number
  avgResolutionTime: number
}) {
  const totalTrend = getTrend(currentTotalIncidents, prevTotalIncidents)
  const openTrend = getTrend(currentOpenIncidents, prevTotalOpenIncidents)
  const slaTrend = getTrend(currentSLACompliance, prevSLACompliance)
  const resolutionTrend = getTrend(
    currentAvgResolutionTime,
    prevAvgResolutionTime,
    true
  )

  const renderBadge = (trend: Trend, invert = false) => {
    const dir = invert
      ? trend.direction === "up"
        ? "down"
        : trend.direction === "down"
        ? "up"
        : "neutral"
      : trend.direction

    return (
      <>
        {dir === "up" && <TrendingUpIcon />}
        {dir === "down" && <TrendingDownIcon />}
        {dir === "neutral" && <span>—</span>}

        {dir === "up" && "+"}
        {dir === "down" && "-"}
        {dir === "neutral" && ""}

        {trend.percent}%
      </>
    )
  }

  const renderFooterIcon = (trend: Trend, invert = false) => {
    const dir = invert
      ? trend.direction === "up"
        ? "down"
        : trend.direction === "down"
        ? "up"
        : "neutral"
      : trend.direction

    if (dir === "up") return <TrendingUpIcon className="size-4" />
    if (dir === "down") return <TrendingDownIcon className="size-4" />
    return <span className="size-4">—</span>
  }

  return (
<div className="grid grid-cols-4 gap-4 px-4 
  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 
  *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 
  dark:*:data-[slot=card]:bg-card">

      {/* Total Incidents */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Incidents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {renderBadge(totalTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {getFooterText("Incidents", totalTrend)}
            {renderFooterIcon(totalTrend)}
          </div>
          <div className="text-muted-foreground">
            Compared to previous period
          </div>
        </CardFooter>
      </Card>

      {/* Open Incidents */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total open incidents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOpenIncidents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {renderBadge(openTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {getFooterText("Open incidents", openTrend)}
            {renderFooterIcon(openTrend)}
          </div>
          <div className="text-muted-foreground">
            Active workload trend
          </div>
        </CardFooter>
      </Card>

      {/* SLA Compliance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>SLA Compliance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {SLACompliance}<span className="text-sm">%</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {renderBadge(slaTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {getFooterText("SLA compliance", slaTrend)}
            {renderFooterIcon(slaTrend)}
          </div>
          <div className="text-muted-foreground">
            Performance against deadlines
          </div>
        </CardFooter>
      </Card>

      {/* Resolution Time */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Resolution Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgResolutionTime}<span className="text-sm">%</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {/* inverted display */}
              {renderBadge(resolutionTrend, true)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {getFooterText("Resolution time", resolutionTrend, {
              invert: true,
            })}
            {renderFooterIcon(resolutionTrend, true)}
          </div>
          <div className="text-muted-foreground">
            Time taken to resolve incidents
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}