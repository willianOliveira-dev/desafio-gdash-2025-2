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

interface Weather {
    currentTime: string;
    windSpeed: number;
}

export function DashboardChartWind({ data }: { data: Weather[] }) {
    const chartData = data
        .map((item) => ({
            time: dateFormat({
                date: new Date(item.currentTime + 'Z'),
                format: 'HH:mm:ss',
            }),
            wind: item.windSpeed,
        }))
        .sort((a, b) => a.time.localeCompare(b.time));

    const chartConfig = {
        wind: {
            label: 'Vento (km/h)',
            color: 'var(--chart-3)',
        },
    } as ChartConfig;

    return (
        <Card className="w-full hover:shadow-md duration-300">
            <CardHeader>
                <CardTitle>Velocidade do Vento</CardTitle>
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
                            dataKey="wind"
                            type="natural"
                            fill="var(--color-wind)"
                            fillOpacity={0.4}
                            stroke="var(--color-wind)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
