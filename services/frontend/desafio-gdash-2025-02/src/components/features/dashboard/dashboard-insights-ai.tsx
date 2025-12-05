import { useQuery } from '@tanstack/react-query';
import { DashboardInsightAi } from './dashboard-insight-ai';
import { api } from '@/services/api';
import { insightIconMap, type InsightIconName } from '@/helpers/insight-icons';
import type { Insight } from '@/interfaces/http/models/insight.interface';
import { toast } from 'sonner';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';

export function DashboardInsightsAi() {
    const { data } = useQuery({
        queryKey: ['weather-insigths'],
        queryFn: async () => {
            try {
                const res = await api<Insight[]>('weather/insights');
                return res.data ?? [];
            } catch (error) {
                const parsed = apiErrorSchema.safeParse(error);
                if (parsed.success) {
                    toast.error(parsed.data.message, {
                        richColors: true,
                    });
                    return;
                }
                toast.error('Erro ao buscar insights.', {
                    richColors: true,
                });
            }
        },
    });

    if (!data || data.length === 0) return null;

    return (
        <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
                Insights de IA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((insight) => {
                    const Icon =
                        insightIconMap[insight.icon as InsightIconName] ??
                        insightIconMap['info'];
                    return (
                        <DashboardInsightAi
                            key={insight.title}
                            title={insight.title}
                            description={insight.description}
                            icon={Icon}
                            type={insight.type}
                        />
                    );
                })}
            </div>
        </section>
    );
}
