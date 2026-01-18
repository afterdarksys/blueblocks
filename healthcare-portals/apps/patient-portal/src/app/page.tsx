"use client";

import { useAuth } from "@blueblocks/auth";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@blueblocks/ui";
import {
  FileText,
  Shield,
  Pill,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function PatientDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Welcome to BlueBlocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Connect your wallet to access your secure health records on the
              blockchain.
            </p>
            <Button className="w-full">Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || "Patient"}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your health records
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Health Records"
          value="24"
          icon={FileText}
          trend="+3 this month"
          color="blue"
        />
        <StatCard
          title="Active Prescriptions"
          value="3"
          icon={Pill}
          trend="1 refill due"
          color="green"
        />
        <StatCard
          title="Access Grants"
          value="5"
          icon={Shield}
          trend="2 pending"
          color="purple"
        />
        <StatCard
          title="Recent Activity"
          value="12"
          icon={Clock}
          trend="Last 7 days"
          color="amber"
        />
      </div>

      {/* Alerts */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">
              Action Required: Dr. Smith is requesting access to your lab results
            </p>
            <p className="text-sm text-amber-700">
              Review and approve or deny the access request
            </p>
          </div>
          <Link href="/access">
            <Button size="sm" variant="outline">
              Review
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="View Records"
          description="Access all your health records"
          icon={FileText}
          href="/records"
        />
        <QuickActionCard
          title="Manage Access"
          description="Control who sees your data"
          icon={Shield}
          href="/access"
        />
        <QuickActionCard
          title="Prescriptions"
          description="View active medications"
          icon={Pill}
          href="/prescriptions"
        />
      </div>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Records</CardTitle>
            <Link href="/records">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                title: "Blood Test Results",
                type: "Lab Result",
                date: "Jan 15, 2026",
                provider: "City Medical Lab",
              },
              {
                title: "Annual Checkup Notes",
                type: "Clinical Notes",
                date: "Jan 10, 2026",
                provider: "Dr. Sarah Johnson",
              },
              {
                title: "Chest X-Ray",
                type: "Imaging",
                date: "Jan 5, 2026",
                provider: "Memorial Hospital",
              },
            ].map((record, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-gray-500">
                      {record.type} - {record.provider}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{record.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  color: "blue" | "green" | "purple" | "amber";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <TrendingUp className="h-3 w-3" />
              <span>{trend}</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
