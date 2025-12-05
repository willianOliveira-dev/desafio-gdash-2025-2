import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShieldUser, User, Users } from 'lucide-react';
import type { UsersCardProps } from '@/interfaces/features/users/users-card.interface';

export function UsersCard({ className, data, variant }: UsersCardProps) {
    const variants = {
        total: {
            icon: Users,
            iconBg: 'bg-primary-500/20',
            iconText: 'text-primary-500',
            title: 'Total de Usuários',
        },
        users: {
            icon: User,
            iconBg: 'bg-emerald-400/20',
            iconText: 'text-emerald-500',
            title: 'Usuários Comuns',
        },
        admins: {
            icon: ShieldUser,
            iconBg: 'bg-orange-500/20',
            iconText: 'text-orange-500',
            title: 'Administradores',
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
