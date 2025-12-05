import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dateFormat } from '@/helpers/date-format';
import type { User } from '@/interfaces/http/models/user.interface';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, Trash } from 'lucide-react';

export function UsersRecord({ data }: { data: User[] }) {
    return (
        <div className="border p-2.5 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-full shrink-0">
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.username}
                                        />
                                        <AvatarFallback className="flex justify-center items-center size-full bg-cyan-500/20 rounded-full">
                                            {user.username
                                                .at(0)
                                                ?.toLocaleUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.firstName ?? user.username}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {dateFormat({
                                    date: new Date(user.createdAt),
                                    format: 'dd/MM/yyyy',
                                })}
                            </TableCell>
                            <TableCell>
                                <Button variant={'ghost'} size={'icon'}>
                                    <Pencil />
                                </Button>
                                <Button
                                    className="text-red-500"
                                    variant={'ghost'}
                                    size={'icon'}
                                >
                                    <Trash />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
