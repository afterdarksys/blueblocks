"use client";

import { useState } from "react";
import { EmergencyAccessRequest, Card, CardHeader, CardTitle, CardContent, AuditLog, type AuditEntry } from "@blueblocks/ui";
import { AlertTriangle, Search } from "lucide-react";

// Mock audit data for emergency accesses
const mockEmergencyAuditLog: AuditEntry[] = [
  {
    id: "aud_1",
    timestamp: Date.now() / 1000 - 86400 * 2,
    action: "emergency_access",
    actorId: "0xdoctor1",
    actorName: "Dr. Sarah Johnson",
    actorRole: "doctor",
    recordId: "rec_123",
    recordTitle: "John Doe - Medical History",
    details: "Critical - Unconscious patient in ER, needed allergy information",
    txHash: "0xabc123...",
  },
  {
    id: "aud_2",
    timestamp: Date.now() / 1000 - 86400 * 14,
    action: "emergency_access",
    actorId: "0xdoctor1",
    actorName: "Dr. Sarah Johnson",
    actorRole: "doctor",
    recordId: "rec_456",
    recordTitle: "Jane Smith - Medications",
    details: "Urgent - Patient with suspected drug interaction",
    txHash: "0xdef456...",
  },
];

export default function EmergencyAccessPage() {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSearch = () => {
    // Mock patient lookup
    if (patientSearch.trim()) {
      setSelectedPatient({
        id: "0xpatient123",
        name: "John Doe",
      });
    }
  };

  const handleEmergencyRequest = async (data: { reason: string; urgencyLevel: string }) => {
    setIsRequesting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Emergency access requested:", data);
      alert("Emergency access granted. This action has been logged.");
      setSelectedPatient(null);
      setPatientSearch("");
    } catch (error) {
      console.error("Failed to request emergency access:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-red-600" />
          Emergency Access
        </h1>
        <p className="text-gray-500 mt-1">
          Request emergency access to patient records when normal consent is not possible
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-medium">Important: Emergency Access is Audited</p>
            <p className="mt-1">
              All emergency access requests are permanently logged on the blockchain and may be reviewed
              by hospital administration, regulatory bodies, and the patient. Only use this feature for
              genuine medical emergencies where patient consent cannot be obtained.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Search */}
      {!selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Find Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Enter patient ID, name, or wallet address..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Search
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Access Form */}
      {selectedPatient && (
        <EmergencyAccessRequest
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onRequestAccess={handleEmergencyRequest}
          onCancel={() => setSelectedPatient(null)}
          isLoading={isRequesting}
        />
      )}

      {/* Recent Emergency Access History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Emergency Access History</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLog
            entries={mockEmergencyAuditLog}
            showFilters={false}
            onViewDetails={(entry) => console.log("View details:", entry)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
