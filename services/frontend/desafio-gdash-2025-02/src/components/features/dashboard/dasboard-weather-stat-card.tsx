import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Cloud, Sunrise, Sunset } from 'lucide-react';
import type { DashboardWeatherStatCardProps } from '@/interfaces/features/dashboard/dashboard-weather-stat-card.interface';

export function DashboardWeatherStatCard({
    className,
    data,
    variant,
}: DashboardWeatherStatCardProps) {
    const variants = {
        sunrise: {
            icon: Sunrise,
            iconBg: 'bg-amber-400/20',
            iconText: 'text-amber-500',
            title: ' Nascer do Sol',
        },
        sunset: {
            icon: Sunset,
            iconBg: 'bg-orange-500/20',
            iconText: 'text-orange-500',
            title: 'Pôr do Sol',
        },
        condition: {
            icon: Cloud,
            iconBg: 'bg-muted',
            iconText: 'text-primary-500',
            title: 'Condição',
        },
    };

    let variantStyle = variants[variant];

    return (
        <Card
            className={cn(
                'w-full max-w-full hover:scale-101 duration-300',
                className
            )}
        >
            <CardContent>
                <div className="flex gap-4">
                    <div
                        className={cn(
                            'self-start p-2 rounded-md',
                            variantStyle.iconBg
                        )}
                    >
                        <variantStyle.icon
                            className={cn('size-5', variantStyle.iconText)}
                        />
                    </div>
                    <div className="flex flex-col gap-0.5 text-text-muted">
                        <span className="text-xs">{variantStyle.title}</span>
                        <span className="font-semibold">{data}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
