'use client';

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
    feelsLike: number;
}

export function DashboardChartFeelsLike({ data }: { data: Weather[] }) {
    const chartData = data
        .map((item) => ({
            time: dateFormat({
                date: new Date(item.currentTime + 'Z'),
                format: 'HH:mm:ss',
            }),
            feelsLike: item.feelsLike,
        }))
        .sort((a, b) => a.time.localeCompare(b.time));

    const chartConfig = {
        feelsLike: {
            label: 'Sensação Térmica (°C)',
            color: 'var(--chart-1)',
        },
    } as ChartConfig;

    return (
        <Card className="w-full hover:shadow-md duration-300">
            <CardHeader>
                <CardTitle>Sensação Térmica</CardTitle>
                <CardDescription>Variação durante o dia</CardDescription>
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
                            dataKey="feelsLike"
                            type="natural"
                            fill="var(--color-feelsLike)"
                            fillOpacity={0.4}
                            stroke="var(--color-feelsLike)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
