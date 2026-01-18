"use client";

import * as React from "react";
import { Shield, Clock, User, AlertTriangle, Check, X } from "lucide-react";
import { cn, formatDate, formatAddress, formatRelativeTime } from "../lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";

export interface AccessGrant {
  id: string;
  granteeId: string;
  granteeName?: string;
  granteeRole: "doctor" | "pharmacist" | "paramedic" | "facility";
  recordTypes: string[];
  grantedAt: number;
  expiresAt: number;
  status: "active" | "expired" | "revoked" | "pending";
  accessCount?: number;
  lastAccess?: number;
  reason?: string;
}

export interface AccessGrantCardProps {
  grant: AccessGrant;
  onRevoke?: (grant: AccessGrant) => void;
  onExtend?: (grant: AccessGrant) => void;
  onApprove?: (grant: AccessGrant) => void;
  onDeny?: (grant: AccessGrant) => void;
  className?: string;
  isPatientView?: boolean;
}

const roleConfig: Record<AccessGrant["granteeRole"], { label: string; color: string }> = {
  doctor: { label: "Doctor", color: "bg-blue-100 text-blue-800" },
  pharmacist: { label: "Pharmacist", color: "bg-green-100 text-green-800" },
  paramedic: { label: "Paramedic", color: "bg-red-100 text-red-800" },
  facility: { label: "Healthcare Facility", color: "bg-purple-100 text-purple-800" },
};

const statusConfig: Record<AccessGrant["status"], { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-green-600", icon: Check },
  expired: { label: "Expired", color: "text-gray-500", icon: Clock },
  revoked: { label: "Revoked", color: "text-red-600", icon: X },
  pending: { label: "Pending Approval", color: "text-amber-600", icon: AlertTriangle },
};

export function AccessGrantCard({
  grant,
  onRevoke,
  onExtend,
  onApprove,
  onDeny,
  className,
  isPatientView = true,
}: AccessGrantCardProps) {
  const role = roleConfig[grant.granteeRole];
  const status = statusConfig[grant.status];
  const StatusIcon = status.icon;
  const isExpiringSoon = grant.status === "active" && grant.expiresAt - Date.now() / 1000 < 86400 * 7;

  return (
    <Card className={cn("relative", className)}>
      {isExpiringSoon && (
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Expires soon
          </span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <CardTitle className="text-base">
              {grant.granteeName || formatAddress(grant.granteeId)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs px-2 py-0.5 rounded-full", role.color)}>
                {role.label}
              </span>
              <span className={cn("text-xs flex items-center gap-1", status.color)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Record Access</p>
          <div className="flex flex-wrap gap-1">
            {grant.recordTypes.map((type) => (
              <span key={type} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {type}
              </span>
            ))}
          </div>
        </div>

        {grant.reason && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Reason</p>
            <p className="text-sm">{grant.reason}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-500">Granted</p>
            <p className="font-medium">{formatDate(grant.grantedAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Expires</p>
            <p className="font-medium">{formatDate(grant.expiresAt)}</p>
          </div>
          {grant.accessCount !== undefined && (
            <div>
              <p className="text-gray-500">Access Count</p>
              <p className="font-medium">{grant.accessCount} times</p>
            </div>
          )}
          {grant.lastAccess && (
            <div>
              <p className="text-gray-500">Last Access</p>
              <p className="font-medium">{formatRelativeTime(grant.lastAccess)}</p>
            </div>
          )}
        </div>
      </CardContent>

      {isPatientView && (
        <CardFooter className="gap-2">
          {grant.status === "pending" && (
            <>
              <Button size="sm" variant="success" onClick={() => onApprove?.(grant)}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDeny?.(grant)}>
                Deny
              </Button>
            </>
          )}
          {grant.status === "active" && (
            <>
              <Button size="sm" variant="outline" onClick={() => onExtend?.(grant)}>
                Extend
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onRevoke?.(grant)}>
                Revoke
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// Form for creating new access grants
export interface AccessGrantFormProps {
  onSubmit: (data: {
    granteeId: string;
    recordTypes: string[];
    duration: number;
    reason?: string;
  }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AccessGrantForm({ onSubmit, onCancel, isLoading }: AccessGrantFormProps) {
  const [granteeId, setGranteeId] = React.useState("");
  const [recordTypes, setRecordTypes] = React.useState<string[]>([]);
  const [duration, setDuration] = React.useState(7); // days
  const [reason, setReason] = React.useState("");

  const availableRecordTypes = [
    "lab_result",
    "prescription",
    "diagnosis",
    "imaging",
    "procedure",
    "notes",
    "vitals",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      granteeId,
      recordTypes,
      duration: duration * 86400, // convert to seconds
      reason: reason || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Provider Address or ID</label>
        <input
          type="text"
          value={granteeId}
          onChange={(e) => setGranteeId(e.target.value)}
          placeholder="0x... or provider ID"
          className="w-full px-3 py-2 border rounded-md text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Record Types to Share</label>
        <div className="flex flex-wrap gap-2">
          {availableRecordTypes.map((type) => (
            <label key={type} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={recordTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRecordTypes([...recordTypes, type]);
                  } else {
                    setRecordTypes(recordTypes.filter((t) => t !== type));
                  }
                }}
                className="rounded"
              />
              {type.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Access Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>1 year</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason (optional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you granting access?"
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isLoading} disabled={!granteeId || recordTypes.length === 0}>
          Grant Access
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
