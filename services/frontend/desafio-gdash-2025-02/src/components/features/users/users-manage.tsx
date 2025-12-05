import { useQuery } from '@tanstack/react-query';
import { UsersCard } from './users-card';
import { api } from '@/services/api';
import { UsersRecord } from './users-record';
import type { User } from '@/interfaces/http/models/user.interface';

export function ManageUsers() {
    const { data } = useQuery({
        queryKey: ['weather-users'],
        queryFn: async () => {
            const res = await api<User[]>('users');
            return res.data ?? [];
        },
    });

    if (!data || data.length === 0) return null;
    console.log(data);
    const total = data.length;
    const totalAdmins = data.filter((user) => user.role === 'admin').length;
    const totalUsers = data.filter((user) => user.role === 'user').length;

    return (
        <>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3">
                <UsersCard data={total} variant="total" />
                <UsersCard data={totalAdmins} variant="admins" />
                <UsersCard data={totalUsers} variant="users" />
            </section>
            <section>
                <UsersRecord data={data} />
            </section>
        </>
    );
}
