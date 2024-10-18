import {
  Card,
} from "@/components/ui/card"

import ChartSection from "./CompareChartCard/ChartSection"
import { YearlyChartDataProvider } from "../provider/YearlyChartDataProvider"

export function CompareChartCard() {

    return (
        <Card >
            <YearlyChartDataProvider>
                <ChartSection
                    section="first"
                />
            </YearlyChartDataProvider>
        
            <YearlyChartDataProvider>
                <ChartSection
                    section="second"
                />
            </YearlyChartDataProvider>
        
        </Card>
    )
}
