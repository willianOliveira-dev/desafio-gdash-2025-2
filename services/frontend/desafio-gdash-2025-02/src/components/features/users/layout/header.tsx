import { MapPin, Plus } from 'lucide-react';
import { Button } from '../../../ui/button';

export function Header() {
    return (
        <header className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-semibold leading-none">
                    Usuários
                </h1>
                <p className="flex items-center gap-0.5 text-sm text-text-muted">
                    <MapPin className="size-3" />
                    Gerencie os usuários do sistema
                </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
                <Button
                    className="text-white bg-primary-500 hover:bg-primary-400 hover:text-white"
                    variant={'outline'}
                >
                    <Plus className="size-5" />
                    Novo usuário
                </Button>
            </div>
        </header>
    );
}
