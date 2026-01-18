"use client";
import { useState } from "react";
import { EmergencyAccessRequest, Card, CardContent, Button } from "@blueblocks/ui";
import { AlertTriangle, Search, QrCode, Fingerprint } from "lucide-react";

export default function EmergencyAccessPage() {
  const [searchMethod, setSearchMethod] = useState<"search" | "qr" | "biometric" | null>(null);
  const [patientId, setPatientId] = useState("");
  const [foundPatient, setFoundPatient] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (patientId.trim()) {
      setFoundPatient({ id: patientId, name: "John Doe (67yo Male)" });
    }
  };

  const handleEmergencyAccess = async (data: { reason: string; urgencyLevel: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    alert("Emergency access granted. Patient records available.");
    setIsLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-3">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Emergency Access</h1>
        <p className="text-gray-400 text-sm mt-1">Bypass consent for medical emergencies</p>
      </div>

      {!foundPatient ? (
        <>
          {/* Search Methods */}
          {!searchMethod && (
            <div className="space-y-3">
              <button
                onClick={() => setSearchMethod("search")}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
              >
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Search by ID</p>
                  <p className="text-gray-400 text-sm">Enter patient ID or name</p>
                </div>
              </button>

              <button
                onClick={() => setSearchMethod("qr")}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
              >
                <div className="p-3 bg-purple-600 rounded-lg">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Scan QR Code</p>
                  <p className="text-gray-400 text-sm">Scan patient wristband or ID card</p>
                </div>
              </button>

              <button
                onClick={() => setSearchMethod("biometric")}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
              >
                <div className="p-3 bg-green-600 rounded-lg">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Biometric ID</p>
                  <p className="text-gray-400 text-sm">Fingerprint or face recognition</p>
                </div>
              </button>
            </div>
          )}

          {/* Search Input */}
          {searchMethod === "search" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-4">
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID, name, or DOB..."
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={() => setSearchMethod(null)} variant="ghost" className="flex-1 text-gray-300">
                    Back
                  </Button>
                  <Button onClick={handleSearch} className="flex-1 bg-red-600 hover:bg-red-700">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Scanner */}
          {searchMethod === "qr" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-8 text-center">
                <div className="w-48 h-48 mx-auto bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="h-16 w-16 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-4">Position QR code in frame</p>
                <Button onClick={() => setSearchMethod(null)} variant="ghost" className="text-gray-300">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Emergency Access Request Form */
        <div className="bg-gray-800 rounded-xl">
          <EmergencyAccessRequest
            patientId={foundPatient.id}
            patientName={foundPatient.name}
            onRequestAccess={handleEmergencyAccess}
            onCancel={() => {
              setFoundPatient(null);
              setSearchMethod(null);
              setPatientId("");
            }}
            isLoading={isLoading}
            className="border-gray-700"
          />
        </div>
      )}

      {/* Warning Footer */}
      <div className="text-center text-gray-500 text-xs px-4 pt-4">
        All emergency access is logged on the blockchain and subject to audit.
        Misuse may result in disciplinary action.
      </div>
    </div>
  );
}
