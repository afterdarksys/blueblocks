"use client";

import { Card, CardHeader, CardTitle, CardContent, Button } from "@blueblocks/ui";
import { Users, FileText, Pill, Clock, AlertTriangle, Calendar } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Dr. Johnson</h1>
        <p className="text-gray-500 mt-1">You have 8 appointments today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Patients" value="156" icon={Users} color="green" />
        <StatCard title="Records Updated" value="24" subtitle="This week" icon={FileText} color="blue" />
        <StatCard title="Prescriptions" value="12" subtitle="Pending" icon={Pill} color="purple" />
        <StatCard title="Appointments" value="8" subtitle="Today" icon={Calendar} color="amber" />
      </div>

      {/* Pending Access Requests */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Access Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { patient: "John Smith", type: "Lab Results", requested: "2 hours ago" },
              { patient: "Emily Davis", type: "Full Medical History", requested: "1 day ago" },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-amber-200 last:border-0">
                <div>
                  <p className="font-medium text-amber-900">{req.patient}</p>
                  <p className="text-sm text-amber-700">{req.type} - {req.requested}</p>
                </div>
                <Button size="sm" variant="outline">View Request</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <Link href="/schedule">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "9:00 AM", patient: "Robert Brown", type: "Follow-up", status: "completed" },
              { time: "10:30 AM", patient: "Sarah Wilson", type: "Annual Physical", status: "in_progress" },
              { time: "11:30 AM", patient: "Michael Lee", type: "Consultation", status: "upcoming" },
              { time: "2:00 PM", patient: "Jennifer Chen", type: "Lab Review", status: "upcoming" },
              { time: "3:30 PM", patient: "David Martinez", type: "Follow-up", status: "upcoming" },
            ].map((appt, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-mono ${
                    appt.status === "completed" ? "text-gray-400" :
                    appt.status === "in_progress" ? "text-green-600 font-bold" : "text-gray-600"
                  }`}>
                    {appt.time}
                  </span>
                  <div>
                    <p className="font-medium">{appt.patient}</p>
                    <p className="text-sm text-gray-500">{appt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appt.status === "in_progress" && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">In Progress</span>
                  )}
                  <Button size="sm" variant={appt.status === "completed" ? "ghost" : "outline"}>
                    {appt.status === "completed" ? "View Notes" : "Start"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/patients">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold">View Patients</h3>
              <p className="text-sm text-gray-500 mt-1">Access patient records and history</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/prescribe">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Pill className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold">Write Prescription</h3>
              <p className="text-sm text-gray-500 mt-1">Create new prescriptions for patients</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/emergency">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-red-200">
            <CardContent className="pt-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-red-900">Emergency Access</h3>
              <p className="text-sm text-red-700 mt-1">Request emergency record access</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: "green" | "blue" | "purple" | "amber";
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
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
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
