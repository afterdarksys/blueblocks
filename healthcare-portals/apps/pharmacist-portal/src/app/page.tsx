"use client";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@blueblocks/ui";
import { Pill, CheckCircle, Clock, AlertTriangle, Package } from "lucide-react";
import Link from "next/link";

export default function PharmacistDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pharmacist Dashboard</h1>
        <p className="text-gray-500 mt-1">CVS Pharmacy - Main Street Location</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Prescriptions" value="23" icon={Clock} color="amber" />
        <StatCard title="Dispensed Today" value="67" icon={CheckCircle} color="green" />
        <StatCard title="Requires Verification" value="5" icon={AlertTriangle} color="red" />
        <StatCard title="Refills Due" value="12" icon={Package} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Prescriptions</CardTitle>
              <Link href="/prescriptions"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { patient: "John Smith", medication: "Lisinopril 10mg", prescriber: "Dr. Johnson", time: "10 min ago" },
                { patient: "Mary Davis", medication: "Metformin 500mg", prescriber: "Dr. Chen", time: "25 min ago" },
                { patient: "Robert Brown", medication: "Atorvastatin 20mg", prescriber: "Dr. Williams", time: "1 hr ago" },
              ].map((rx, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{rx.medication}</p>
                      <p className="text-sm text-gray-500">{rx.patient} - {rx.prescriber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{rx.time}</span>
                    <div className="mt-1">
                      <Button size="sm">Process</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { issue: "Drug Interaction Alert", patient: "Emily Chen", detail: "Warfarin + Aspirin" },
                { issue: "Insurance Pre-Auth Required", patient: "David Lee", detail: "Humira 40mg" },
                { issue: "Prescriber Verification Needed", patient: "Sarah Wilson", detail: "Controlled substance" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-amber-200 last:border-0">
                  <div>
                    <p className="font-medium text-amber-900">{alert.issue}</p>
                    <p className="text-sm text-amber-700">{alert.patient} - {alert.detail}</p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/verify">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold">Verify Prescription</h3>
              <p className="text-sm text-gray-500 mt-1">Scan or enter Rx to verify on blockchain</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dispense">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Pill className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold">Dispense Medication</h3>
              <p className="text-sm text-gray-500 mt-1">Record dispense on the blockchain</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/history">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold">Dispense History</h3>
              <p className="text-sm text-gray-500 mt-1">View past dispensing records</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}><Icon className="h-6 w-6" /></div>
        </div>
      </CardContent>
    </Card>
  );
}
