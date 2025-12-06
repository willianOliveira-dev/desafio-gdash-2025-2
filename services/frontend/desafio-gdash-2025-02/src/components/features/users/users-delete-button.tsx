import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import type { UsersDeleteButtonProps } from '@/interfaces/features/users/users-delete-button.interface';
import { settings } from '@/config/settings';

export function UsersDeleteButton({ user, ...props }: UsersDeleteButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await fetch(settings.VITE_API_URL + `/users/${user._id}`, {
                method: 'DELETE',
            });

            toast.success('Usuário deletado com sucesso!', {
                richColors: true,
            });

            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsDialogOpen(false);
        } catch (error) {
            console.log(error);
            const parsed = apiErrorSchema.safeParse(error);

            if (parsed.success) {
                toast.error(parsed.data.message, { richColors: true });
                return;
            }

            toast.error('Erro ao deletar usuário.', { richColors: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    disabled={
                        settings.VITE_ENSURE_DEFAULT_USER_USERNAME ===
                        user.username
                    }
                    {...props}
                    variant="ghost"
                    size={'icon'}
                >
                    <Trash className="text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O usuário{' '}
                        {user.username} será permanentemente removido do
                        sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleSubmit}
                    >
                        {isLoading ? 'Deletando...' : 'Continuar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
