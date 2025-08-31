'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  Rectangle,
  XAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DashboardStats } from '@/types/api';

// Chart for User Roles (Bar Chart)
const userRolesChartConfig = {
  count: {
    label: 'Users',
  },
  admin: {
    label: 'Admin',
    color: 'hsl(var(--chart-1))',
  },
  agent: {
    label: 'Agent',
    color: 'hsl(var(--chart-2))',
  },
  home_seeker: {
    label: 'Home Seeker',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function UserRolesChart({
  data,
}: {
  data: DashboardStats['users']['by_role'];
}) {
  const chartData = React.useMemo(() => {
    return [
      { role: 'admin', count: data.admin, fill: 'var(--color-admin)' },
      { role: 'agent', count: data.agent, fill: 'var(--color-agent)' },
      {
        role: 'home_seeker',
        count: data.home_seeker,
        fill: 'var(--color-home_seeker)',
      },
    ];
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles Distribution</CardTitle>
        <CardDescription>A breakdown of users by their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={userRolesChartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                userRolesChartConfig[value as keyof typeof userRolesChartConfig]
                  ?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              strokeWidth={2}
              radius={8}
              activeBar={({ ...props }) => (
                <Rectangle {...props} fillOpacity={0.8} />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Chart for Property Status (Donut Chart)
const propertyStatusChartConfig = {
  value: {
    label: 'Properties',
  },
  available: {
    label: 'Available',
    color: 'hsl(var(--chart-1))',
  },
  rented: {
    label: 'Rented',
    color: 'hsl(var(--chart-2))',
  },
  sold: {
    label: 'Sold',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function PropertyStatusChart({ data }: { data: DashboardStats['properties'] }) {
  const chartData = React.useMemo(() => {
    return [
      {
        status: 'available',
        value: data.available,
        fill: 'var(--color-available)',
      },
      { status: 'rented', value: data.rented, fill: 'var(--color-rented)' },
      { status: 'sold', value: data.sold, fill: 'var(--color-sold)' },
    ];
  }, [data]);

  const totalProperties = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Property Status</CardTitle>
        <CardDescription>
          A breakdown of properties by their current status
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={propertyStatusChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProperties.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Properties
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Chart for KYC Status (Pie Chart)
const kycStatusChartConfig = {
  value: {
    label: 'KYC Verifications',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-1))',
  },
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-2))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function KycStatusChart({ data }: { data: DashboardStats['kyc'] }) {
  const chartData = React.useMemo(() => {
    return [
      {
        status: 'pending',
        value: data.pending,
        fill: 'var(--color-pending)',
      },
      {
        status: 'approved',
        value: data.approved,
        fill: 'var(--color-approved)',
      },
      {
        status: 'rejected',
        value: data.rejected,
        fill: 'var(--color-rejected)',
      },
    ].filter((item) => item.value > 0);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>KYC Status</CardTitle>
          <CardDescription>
            A breakdown of KYC verifications by status
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <p className="text-muted-foreground">No KYC data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>KYC Status</CardTitle>
        <CardDescription>
          A breakdown of KYC verifications by status
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={kycStatusChartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie data={chartData} dataKey="value">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof kycStatusChartConfig) =>
                  kycStatusChartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}