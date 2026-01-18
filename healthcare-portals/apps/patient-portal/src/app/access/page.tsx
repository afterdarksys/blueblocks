"use client";

import { useState } from "react";
import {
  AccessGrantCard,
  AccessGrantForm,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  type AccessGrant,
} from "@blueblocks/ui";
import { Plus, Shield } from "lucide-react";

// Mock data
const mockGrants: AccessGrant[] = [
  {
    id: "grant_1",
    granteeId: "0xdoctor1",
    granteeName: "Dr. Sarah Johnson",
    granteeRole: "doctor",
    recordTypes: ["lab_result", "diagnosis", "vitals"],
    grantedAt: Date.now() / 1000 - 86400 * 30,
    expiresAt: Date.now() / 1000 + 86400 * 60,
    status: "active",
    accessCount: 5,
    lastAccess: Date.now() / 1000 - 86400 * 2,
    reason: "Primary care physician - ongoing treatment",
  },
  {
    id: "grant_2",
    granteeId: "0xpharmacy1",
    granteeName: "CVS Pharmacy",
    granteeRole: "pharmacist",
    recordTypes: ["prescription"],
    grantedAt: Date.now() / 1000 - 86400 * 90,
    expiresAt: Date.now() / 1000 + 86400 * 275,
    status: "active",
    accessCount: 12,
    lastAccess: Date.now() / 1000 - 86400 * 7,
    reason: "Regular pharmacy for prescriptions",
  },
  {
    id: "grant_3",
    granteeId: "0xdoctor2",
    granteeName: "Dr. Michael Chen",
    granteeRole: "doctor",
    recordTypes: ["imaging", "diagnosis"],
    grantedAt: Date.now() / 1000 - 86400 * 5,
    expiresAt: Date.now() / 1000 + 86400 * 2,
    status: "active",
    accessCount: 2,
    lastAccess: Date.now() / 1000 - 86400 * 1,
    reason: "Specialist consultation - radiology review",
  },
  {
    id: "grant_4",
    granteeId: "0xspecialist1",
    granteeName: "Dr. Emily Roberts",
    granteeRole: "doctor",
    recordTypes: ["lab_result", "diagnosis"],
    grantedAt: Date.now() / 1000 - 86400 * 1,
    expiresAt: Date.now() / 1000 + 86400 * 29,
    status: "pending",
    reason: "Referred by Dr. Johnson for cardiology consultation",
  },
];

export default function AccessPage() {
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [grants, setGrants] = useState(mockGrants);

  const activeGrants = grants.filter((g) => g.status === "active");
  const pendingGrants = grants.filter((g) => g.status === "pending");
  const expiredGrants = grants.filter((g) => g.status === "expired" || g.status === "revoked");

  const handleRevoke = (grant: AccessGrant) => {
    setGrants(
      grants.map((g) =>
        g.id === grant.id ? { ...g, status: "revoked" as const } : g
      )
    );
  };

  const handleApprove = (grant: AccessGrant) => {
    setGrants(
      grants.map((g) =>
        g.id === grant.id ? { ...g, status: "active" as const } : g
      )
    );
  };

  const handleDeny = (grant: AccessGrant) => {
    setGrants(
      grants.map((g) =>
        g.id === grant.id ? { ...g, status: "revoked" as const } : g
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-500 mt-1">
            Manage who can access your health records
          </p>
        </div>
        <Button onClick={() => setShowGrantForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
      </div>

      {/* Grant Form Modal */}
      {showGrantForm && (
        <Card>
          <CardHeader>
            <CardTitle>Grant New Access</CardTitle>
          </CardHeader>
          <CardContent>
            <AccessGrantForm
              onSubmit={(data) => {
                console.log("Grant access:", data);
                setShowGrantForm(false);
              }}
              onCancel={() => setShowGrantForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Pending Requests */}
      {pendingGrants.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            Pending Requests ({pendingGrants.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingGrants.map((grant) => (
              <AccessGrantCard
                key={grant.id}
                grant={grant}
                onApprove={handleApprove}
                onDeny={handleDeny}
                isPatientView={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Grants */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Active Access Grants ({activeGrants.length})
        </h2>
        {activeGrants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrants.map((grant) => (
              <AccessGrantCard
                key={grant.id}
                grant={grant}
                onRevoke={handleRevoke}
                onExtend={(g) => console.log("Extend:", g.id)}
                isPatientView={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active access grants</p>
              <p className="text-sm text-gray-400 mt-1">
                Grant access to healthcare providers to share your records
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expired/Revoked */}
      {expiredGrants.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Expired/Revoked ({expiredGrants.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {expiredGrants.map((grant) => (
              <AccessGrantCard
                key={grant.id}
                grant={grant}
                isPatientView={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
