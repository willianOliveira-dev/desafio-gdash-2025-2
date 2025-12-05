import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useState } from 'react';

import type { WeatherPageResult } from '@/interfaces/http/models/weather-page-result.interface';
import { dateFormat } from '@/helpers/date-format';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';
import { toast } from 'sonner';

const LIMIT = 10;

export function DasboardRecordHistory() {
    const [page, setPage] = useState(1);
    const offset = (page - 1) * LIMIT;

    const { data, isLoading } = useQuery({
        queryKey: ['weather-logs', page],
        queryFn: async () => {
            try {
                const res = await api<WeatherPageResult>(
                    `weather/logs?limit=${LIMIT}&offset=${offset}`
                );

                if (res.data) {
                    return res.data;
                }
            } catch (error) {
                const parsed = apiErrorSchema.safeParse(error);
                if (parsed.success) {
                    toast.error(parsed.data.message, {
                        richColors: true,
                    });
                    return;
                }
                toast.error('Erro ao buscar logs de registros climáticos.', {
                    richColors: true,
                });
            }
        },
    });

    if (isLoading) return <p>Carregando...</p>;

    if (!data || !data.data || !data.meta) return null;

    const records = data.data;
    const meta = data.meta;

    const start = offset + 1;
    const end = Math.min(offset + meta.limit, meta.total);

    return (
        <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
                Histórico de Registros
            </h2>

            <div className="border p-2.5 rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Local</TableHead>
                            <TableHead>Condição</TableHead>
                            <TableHead className="text-right">
                                Umidade
                            </TableHead>
                            <TableHead className="text-right">Temp.</TableHead>
                            <TableHead className="text-right">Vento</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {records.map((item) => (
                            <TableRow key={item.currentTime}>
                                <TableCell className="font-medium">
                                    {dateFormat({
                                        date: new Date(item.currentTime + 'Z'),
                                        format: 'dd/MM/yyyy - HH:mm:ss',
                                    })}
                                </TableCell>

                                <TableCell>
                                    {item.city}, {item.country}
                                </TableCell>

                                <TableCell>{item.condition}</TableCell>

                                <TableCell className="text-right">
                                    {item.humidity}%
                                </TableCell>

                                <TableCell className="text-right">
                                    {item.temperature}°C
                                </TableCell>

                                <TableCell className="text-right">
                                    {item.windSpeed} km/h
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableCaption>
                        <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-sm text-text-muted">
                                Mostrando {start} - {end} de {meta.total}
                            </p>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPage((prev) => prev - 1)}
                                    disabled={!meta.hasPrev}
                                >
                                    <ChevronLeft />
                                </Button>

                                <p className="text-xs">
                                    {meta.page}/{meta.totalPages}
                                </p>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPage((prev) => prev + 1)}
                                    disabled={!meta.hasNext}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </TableCaption>
                </Table>
            </div>
        </section>
    );
}
