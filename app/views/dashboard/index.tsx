import React from "react";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import { useSelector } from "react-redux";
import { useContent } from "@thoughtbot/superglue";
import {
  StatsCard,
  DailyHoursChart,
  EarningsChart,
} from "../../frontend/components/charts";
import { Clock, DollarSign, Folder, TrendingUp } from "lucide-react";

interface User {
  username: string;
  email: string;
  id: number;
}

interface RootState {
  user: User;
}

// Dashboard data types for when charts are implemented
interface DashboardStats {
  hoursThisMonth: {
    value: number;
    label: string;
    change: number;
  };
  earningsThisMonth: {
    value: number;
    label: string;
    change: number;
  };
  activeProjects: {
    value: number;
    label: string;
    change: number;
  };
  avgHourlyRate: {
    value: number;
    label: string;
    change: number;
  };
  dailyHours: Array<{
    date: string;
    hours: number;
  }>;
  earningsOverTime: Array<{
    period: string;
    amount: number;
  }>;
}

export default function DashboardIndex() {
  const user = useSelector((state: RootState) => state.user);
  const dashboardData = useContent<DashboardStats>();

  const {
    hoursThisMonth,
    earningsThisMonth,
    activeProjects,
    avgHourlyRate,
    dailyHours,
    earningsOverTime,
  } = dashboardData;

  return (
    <AppLayout>
      <div className="py-6 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.username}. Here's your freelance activity
            overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-12 w-full gap-x-6 gap-y-6 mb-8">
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <StatsCard
              title={hoursThisMonth.label}
              value={hoursThisMonth.value}
              refresh={true}
              refreshPath="/dashboard?props_at=data.hoursThisMonth"
              icon={<Clock />}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <StatsCard
              title={earningsThisMonth.label}
              value={earningsThisMonth.value}
              icon={<DollarSign />}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <StatsCard
              title={activeProjects.label}
              value={activeProjects.value}
              icon={<Folder />}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <StatsCard
              title={avgHourlyRate.label}
              value={avgHourlyRate.value}
              icon={<TrendingUp />}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-6 mb-8">
            <DailyHoursChart data={dailyHours} title="This Week's Hours" />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-6 mb-8">
            <EarningsChart data={earningsOverTime} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
