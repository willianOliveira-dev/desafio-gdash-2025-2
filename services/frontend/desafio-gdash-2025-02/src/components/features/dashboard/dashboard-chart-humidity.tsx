import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { dateFormat } from '@/helpers/date-format';
import type { Weather } from '@/interfaces/http/models/weather.interface';

export function DashboardChartHumidity({ data }: { data: Weather[] }) {
    const chartData = data.map((item) => ({
        time: dateFormat({
            date: new Date(item.currentTime + 'Z'),
            format: 'HH:mm:ss',
        }),
        humidity: item.humidity,
    })).sort((a, b) => a.time.localeCompare(b.time));;

    const chartConfig = {
        humidity: {
            label: 'Umidade (%)',
            color: 'var(--chart-2)',
        },
    } as ChartConfig;

    return (
        <Card className="w-full hover:shadow-md duration-300">
            <CardHeader>
                <CardTitle>Umidade ao longo do dia</CardTitle>
                <CardDescription>
                    Dados a partir do início da coleta
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="humidity"
                            type="natural"
                            fill="var(--color-humidity)"
                            fillOpacity={0.4}
                            stroke="var(--color-humidity)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
