"use client";
import { Card, CardContent, Button } from "@blueblocks/ui";
import { AlertTriangle, User, Activity, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ParamedicDashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Unit 42 - On Duty</p>
          <p className="text-white text-lg font-bold">Active Call</p>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm">Online</span>
        </div>
      </div>

      {/* Emergency Quick Access */}
      <Link href="/emergency">
        <Card className="bg-red-600 border-red-500 hover:bg-red-700 transition-colors">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-3 text-white">
              <AlertTriangle className="h-8 w-8 animate-pulse" />
              <div className="text-center">
                <p className="text-xl font-bold">EMERGENCY ACCESS</p>
                <p className="text-red-200 text-sm">Tap for immediate patient lookup</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Current Dispatch */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Active Dispatch - 12:34</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">123 Main Street, Apt 4B</p>
                <p className="text-gray-400 text-sm">Downtown Medical District</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">John Doe, 67yo Male</p>
                <p className="text-gray-400 text-sm">Chief complaint: Chest pain</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <a href="tel:5551234567" className="text-blue-400">(555) 123-4567</a>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">View Patient</Button>
            <Button className="flex-1 bg-gray-700 hover:bg-gray-600" variant="outline">Navigate</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/patient">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors h-full">
            <CardContent className="py-5 text-center">
              <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Patient Lookup</p>
              <p className="text-gray-400 text-xs mt-1">Search records</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/vitals">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors h-full">
            <CardContent className="py-5 text-center">
              <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Record Vitals</p>
              <p className="text-gray-400 text-xs mt-1">BP, HR, SpO2, Temp</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Patients */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-4">
          <p className="text-gray-400 text-sm mb-3">Recent Patients</p>
          <div className="space-y-3">
            {[
              { name: "Jane Smith", age: 45, time: "2 hrs ago", chief: "Difficulty breathing" },
              { name: "Michael Brown", age: 32, time: "5 hrs ago", chief: "Trauma - MVA" },
            ].map((patient, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white font-medium">{patient.name}, {patient.age}yo</p>
                  <p className="text-gray-400 text-sm">{patient.chief}</p>
                </div>
                <span className="text-gray-500 text-xs">{patient.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
