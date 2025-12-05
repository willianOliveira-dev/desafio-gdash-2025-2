import { useQuery } from '@tanstack/react-query';
import { DasboardWeatherMainCard } from './dashboard-weather-main-card';
import {
    Cloud,
    Droplets,
    Gauge,
    Sun,
    Thermometer,
    ThermometerSun,
    Wind,
} from 'lucide-react';
import { api } from '@/services/api';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';
import { toast } from 'sonner';
import type { Weather } from '@/interfaces/http/models/weather.interface';
import { DashboardWeatherStatCard } from './dasboard-weather-stat-card';
import { dateFormat } from '@/helpers/date-format';

export function DashboardWeatherCards() {
    const { data } = useQuery({
        queryKey: ['weather-today'],
        queryFn: async () => {
            try {
                const data = await api<Weather[]>('weather/today');
                return data.data && data.data.at(0);
            } catch (error) {
                const parsed = apiErrorSchema.safeParse(error);
                if (parsed.success) {
                    toast.error(parsed.data.message);
                }
            }
        },
    });

    if (!data) {
        return null;
    }

    return (
        <section className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-3">
                <DasboardWeatherMainCard
                    title="Temperatura"
                    icon={Thermometer}
                    data={`${data.temperature}ºC`}
                    variant="temperature"
                />
                <DasboardWeatherMainCard
                    title="Min/Max"
                    icon={ThermometerSun}
                    data={`${data.tempMin}º/${data?.tempMax}º`}
                    variant="temperatureMinMax"
                />
                <DasboardWeatherMainCard
                    title="Umidade"
                    icon={Droplets}
                    data={`${data?.humidity}%`}
                />
                <DasboardWeatherMainCard
                    title="Nuvens"
                    icon={Cloud}
                    data={`${data?.clouds}%`}
                    variant="clouds"
                />
                <DasboardWeatherMainCard
                    title="Vento"
                    icon={Wind}
                    data={`${data.windSpeed} m/s`}
                />
                <DasboardWeatherMainCard
                    title="Sensação térmica"
                    icon={Sun}
                    data={`${data.feelsLike}ºC`}
                    variant="windChill"
                />
                <DasboardWeatherMainCard
                    className="col-span-1 sm:col-span-2 xl:col-span-1"
                    title="Pressão"
                    icon={Gauge}
                    data={`${data.pressure}hPa`}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3">
                <DashboardWeatherStatCard
                    data={dateFormat({
                        date: new Date(data.sunrise),
                        format: 'HH:mm:ss',
                    })}
                    variant="sunrise"
                />
                <DashboardWeatherStatCard
                    data={dateFormat({
                        date: new Date(data.sunset),
                        format: 'HH:mm:ss',
                    })}
                    variant="sunset"
                />
                <DashboardWeatherStatCard
                    className="col-span-1 sm:col-span-2 xl:col-span-1"
                    data={`${data.condition}`}
                    variant="condition"
                />
            </div>
        </section>
    );
}
