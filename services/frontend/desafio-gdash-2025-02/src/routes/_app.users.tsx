import { Header } from '@/components/features/users/layout/header';
import { ManageUsers } from '@/components/features/users/users-manage';
import { Content } from '@/components/layout/content';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/users')({
    component: Users,
});

function Users() {
    return (
        <Content>
            <Header />
            <ManageUsers/>
        </Content>
    );
}
