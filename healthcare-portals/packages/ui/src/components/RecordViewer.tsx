"use client";

import * as React from "react";
import { FileText, Lock, Unlock, Clock, User, Building2 } from "lucide-react";
import { cn, formatDate, formatAddress } from "../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Button } from "./Button";

export interface HealthRecord {
  id: string;
  patientId: string;
  recordType: "lab_result" | "prescription" | "diagnosis" | "imaging" | "procedure" | "notes" | "vitals";
  title: string;
  description?: string;
  ipfsCid: string;
  createdAt: number;
  createdBy: string;
  createdByName?: string;
  facility?: string;
  isEncrypted: boolean;
  accessGranted?: boolean;
}

export interface RecordViewerProps {
  record: HealthRecord;
  onView?: (record: HealthRecord) => void;
  onRequestAccess?: (record: HealthRecord) => void;
  onDownload?: (record: HealthRecord) => void;
  className?: string;
  showActions?: boolean;
  role: "patient" | "doctor" | "pharmacist" | "paramedic";
}

const recordTypeConfig: Record<HealthRecord["recordType"], { label: string; color: string }> = {
  lab_result: { label: "Lab Result", color: "bg-purple-100 text-purple-800" },
  prescription: { label: "Prescription", color: "bg-blue-100 text-blue-800" },
  diagnosis: { label: "Diagnosis", color: "bg-red-100 text-red-800" },
  imaging: { label: "Imaging", color: "bg-cyan-100 text-cyan-800" },
  procedure: { label: "Procedure", color: "bg-orange-100 text-orange-800" },
  notes: { label: "Clinical Notes", color: "bg-gray-100 text-gray-800" },
  vitals: { label: "Vitals", color: "bg-green-100 text-green-800" },
};

export function RecordViewer({
  record,
  onView,
  onRequestAccess,
  onDownload,
  className,
  showActions = true,
  role,
}: RecordViewerProps) {
  const typeConfig = recordTypeConfig[record.recordType];
  const canView = !record.isEncrypted || record.accessGranted;

  // Role-based visibility
  const canRequestAccess = role !== "patient" && !record.accessGranted;
  const canDownload = role === "patient" || record.accessGranted;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-base">{record.title}</CardTitle>
              <span className={cn("text-xs px-2 py-0.5 rounded-full mt-1 inline-block", typeConfig.color)}>
                {typeConfig.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {record.isEncrypted ? (
              record.accessGranted ? (
                <Unlock className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-amber-600" />
              )
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {record.description && (
          <p className="text-sm text-gray-600 mb-3">{record.description}</p>
        )}

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(record.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span>{record.createdByName || formatAddress(record.createdBy)}</span>
          </div>
          {record.facility && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" />
              <span>{record.facility}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {canView ? (
              <Button size="sm" onClick={() => onView?.(record)}>
                View Record
              </Button>
            ) : canRequestAccess ? (
              <Button size="sm" variant="outline" onClick={() => onRequestAccess?.(record)}>
                Request Access
              </Button>
            ) : (
              <Button size="sm" variant="ghost" disabled>
                Access Required
              </Button>
            )}
            {canDownload && (
              <Button size="sm" variant="ghost" onClick={() => onDownload?.(record)}>
                Download
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
