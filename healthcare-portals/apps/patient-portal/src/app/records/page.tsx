"use client";

import { useState } from "react";
import { RecordViewer, Card, CardHeader, CardTitle, CardContent, Button, type HealthRecord } from "@blueblocks/ui";
import { Plus, Filter, Search } from "lucide-react";

// Mock data - replace with actual contract calls
const mockRecords: HealthRecord[] = [
  {
    id: "rec_1",
    patientId: "0x1234",
    recordType: "lab_result",
    title: "Complete Blood Count (CBC)",
    description: "Annual blood work results",
    ipfsCid: "QmXyz...",
    createdAt: Date.now() / 1000 - 86400 * 3,
    createdBy: "0xdoctor1",
    createdByName: "Dr. Sarah Johnson",
    facility: "City Medical Lab",
    isEncrypted: true,
    accessGranted: true,
  },
  {
    id: "rec_2",
    patientId: "0x1234",
    recordType: "diagnosis",
    title: "Annual Physical Examination",
    description: "Routine checkup - all results normal",
    ipfsCid: "QmAbc...",
    createdAt: Date.now() / 1000 - 86400 * 10,
    createdBy: "0xdoctor1",
    createdByName: "Dr. Sarah Johnson",
    facility: "Primary Care Clinic",
    isEncrypted: true,
    accessGranted: true,
  },
  {
    id: "rec_3",
    patientId: "0x1234",
    recordType: "imaging",
    title: "Chest X-Ray",
    description: "Routine chest imaging",
    ipfsCid: "QmDef...",
    createdAt: Date.now() / 1000 - 86400 * 30,
    createdBy: "0xdoctor2",
    createdByName: "Dr. Michael Chen",
    facility: "Memorial Hospital Radiology",
    isEncrypted: true,
    accessGranted: true,
  },
  {
    id: "rec_4",
    patientId: "0x1234",
    recordType: "vitals",
    title: "Blood Pressure Reading",
    description: "Self-reported home measurement: 120/80",
    ipfsCid: "QmGhi...",
    createdAt: Date.now() / 1000 - 86400 * 1,
    createdBy: "0x1234",
    createdByName: "Self-reported",
    isEncrypted: false,
    accessGranted: true,
  },
];

export default function RecordsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = mockRecords.filter((record) => {
    if (filter !== "all" && record.recordType !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        record.title.toLowerCase().includes(query) ||
        record.description?.toLowerCase().includes(query) ||
        record.createdByName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-500 mt-1">
            View and manage all your health records
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Self-Reported Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="lab_result">Lab Results</option>
                <option value="diagnosis">Diagnoses</option>
                <option value="imaging">Imaging</option>
                <option value="prescription">Prescriptions</option>
                <option value="vitals">Vitals</option>
                <option value="notes">Clinical Notes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((record) => (
          <RecordViewer
            key={record.id}
            record={record}
            role="patient"
            onView={(r) => console.log("View record:", r.id)}
            onDownload={(r) => console.log("Download record:", r.id)}
          />
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No records found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
