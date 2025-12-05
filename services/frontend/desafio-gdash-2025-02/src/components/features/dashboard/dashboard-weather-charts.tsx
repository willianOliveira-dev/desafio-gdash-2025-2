import { useQuery } from '@tanstack/react-query';
import { DashboardChartHumidity } from './dashboard-chart-humidity';
import { DashboardChartFeelsLike } from './dashboard-chart-feels-like';
import { api } from '@/services/api';
import { DashboardChartWind } from './dashboard-chart-wind';
import type { Weather } from '@/interfaces/http/models/weather.interface';
import { toast } from 'sonner';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';

export function DashboardWeatherCharts() {
    const { data } = useQuery({
        queryKey: ['weather-charts-today'],
        queryFn: async () => {
            try {
                const res = await api<Weather[]>('weather/today');
                return res.data ?? [];
            } catch (error) {
                const parsed = apiErrorSchema.safeParse(error);
                if (parsed.success) {
                    toast.error(parsed.data.message, {
                        richColors: true,
                    });
                    return;
                }
                toast.error('Erro ao buscar dados climáticos de hoje.', {
                    richColors: true,
                });
            }
        },
    });
    console.log(data);
    if (!data || data.length === 0) return null;

    return (
        <section className="flex flex-col lg:flex-row gap-4">
            <DashboardChartFeelsLike data={data} />
            <DashboardChartHumidity data={data} />
            <DashboardChartWind data={data} />
        </section>
    );
}
