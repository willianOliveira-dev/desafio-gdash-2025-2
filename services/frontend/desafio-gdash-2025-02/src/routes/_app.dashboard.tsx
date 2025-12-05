import { DashboardWeatherCards } from '@/components/features/dashboard/dashboard-weather-cards';
import { DashboardWeatherCharts } from '@/components/features/dashboard/dashboard-weather-charts';
import { DashboardInsightsAi } from '@/components/features/dashboard/dashboard-insights-ai';
import { DasboardRecordHistory } from '@/components/features/dashboard/dashboard-record-history';
import { Content } from '@/components/layout/content';
import { Header } from '@/components/features/dashboard/layout/header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
    component: Dashboard,
});

function Dashboard() {
    return (
        <Content>
            <Header />
            <DashboardWeatherCards />
            <DashboardWeatherCharts />
            <DashboardInsightsAi />
            <DasboardRecordHistory />
        </Content>
    );
}
