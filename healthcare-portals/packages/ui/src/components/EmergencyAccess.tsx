"use client";

import * as React from "react";
import { AlertTriangle, Shield, Clock, FileText } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";

export interface EmergencyAccessProps {
  patientId: string;
  patientName?: string;
  onRequestAccess: (data: { reason: string; urgencyLevel: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function EmergencyAccessRequest({
  patientId,
  patientName,
  onRequestAccess,
  onCancel,
  isLoading,
  className,
}: EmergencyAccessProps) {
  const [reason, setReason] = React.useState("");
  const [urgencyLevel, setUrgencyLevel] = React.useState<"critical" | "urgent" | "standard">("urgent");
  const [acknowledged, setAcknowledged] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) return;
    onRequestAccess({ reason, urgencyLevel });
  };

  return (
    <Card className={cn("border-red-200 bg-red-50/30", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-red-900">Emergency Access Request</CardTitle>
            <p className="text-sm text-red-700 mt-1">
              Patient: {patientName || patientId}
            </p>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex gap-2">
              <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">This action is logged and audited</p>
                <p className="mt-1">
                  Emergency access bypasses patient consent but creates a permanent audit record.
                  Misuse may result in legal consequences.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Urgency Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["critical", "urgent", "standard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgencyLevel(level)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    urgencyLevel === level
                      ? level === "critical"
                        ? "border-red-500 bg-red-100 text-red-800"
                        : level === "urgent"
                        ? "border-amber-500 bg-amber-100 text-amber-800"
                        : "border-blue-500 bg-blue-100 text-blue-800"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {urgencyLevel === "critical" && "Life-threatening emergency requiring immediate intervention"}
              {urgencyLevel === "urgent" && "Serious condition requiring prompt attention"}
              {urgencyLevel === "standard" && "Non-emergency but patient unable to provide consent"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Medical Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the medical emergency and why immediate access is required..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={3}
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="acknowledge"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 rounded"
            />
            <label htmlFor="acknowledge" className="text-sm text-gray-700">
              I acknowledge that this emergency access request will be permanently logged on the
              blockchain and may be subject to audit. I confirm this is a legitimate medical
              emergency.
            </label>
          </div>
        </CardContent>

        <CardFooter className="gap-2 bg-gray-50 rounded-b-lg">
          <Button
            type="submit"
            variant="destructive"
            loading={isLoading}
            disabled={!acknowledged || !reason.trim()}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Request Emergency Access
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

// Banner shown when viewing records via emergency access
export function EmergencyAccessBanner({
  expiresAt,
  reason,
  className,
}: {
  expiresAt: number;
  reason: string;
  className?: string;
}) {
  const remainingTime = Math.max(0, expiresAt - Date.now() / 1000);
  const minutes = Math.floor(remainingTime / 60);

  return (
    <div className={cn("bg-red-600 text-white px-4 py-2 rounded-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Emergency Access Active</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {minutes}m remaining
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {reason.slice(0, 50)}...
          </span>
        </div>
      </div>
    </div>
  );
}
