"use client";

import * as React from "react";
import { Eye, Download, Edit, Trash2, Share2, Lock, AlertCircle } from "lucide-react";
import { cn, formatDate, formatAddress } from "../lib/utils";

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: "view" | "download" | "edit" | "delete" | "share" | "access_granted" | "access_revoked" | "emergency_access";
  actorId: string;
  actorName?: string;
  actorRole: "patient" | "doctor" | "pharmacist" | "paramedic" | "system";
  recordId?: string;
  recordTitle?: string;
  details?: string;
  ipAddress?: string;
  txHash?: string;
}

export interface AuditLogProps {
  entries: AuditEntry[];
  onViewDetails?: (entry: AuditEntry) => void;
  className?: string;
  showFilters?: boolean;
}

const actionConfig: Record<AuditEntry["action"], { label: string; icon: React.ElementType; color: string }> = {
  view: { label: "Viewed", icon: Eye, color: "text-blue-600 bg-blue-50" },
  download: { label: "Downloaded", icon: Download, color: "text-green-600 bg-green-50" },
  edit: { label: "Modified", icon: Edit, color: "text-amber-600 bg-amber-50" },
  delete: { label: "Deleted", icon: Trash2, color: "text-red-600 bg-red-50" },
  share: { label: "Shared", icon: Share2, color: "text-purple-600 bg-purple-50" },
  access_granted: { label: "Access Granted", icon: Lock, color: "text-green-600 bg-green-50" },
  access_revoked: { label: "Access Revoked", icon: Lock, color: "text-red-600 bg-red-50" },
  emergency_access: { label: "Emergency Access", icon: AlertCircle, color: "text-red-600 bg-red-50" },
};

const roleColors: Record<AuditEntry["actorRole"], string> = {
  patient: "bg-gray-100 text-gray-800",
  doctor: "bg-blue-100 text-blue-800",
  pharmacist: "bg-green-100 text-green-800",
  paramedic: "bg-red-100 text-red-800",
  system: "bg-purple-100 text-purple-800",
};

export function AuditLog({ entries, onViewDetails, className, showFilters = true }: AuditLogProps) {
  const [filter, setFilter] = React.useState<AuditEntry["action"] | "all">("all");
  const [roleFilter, setRoleFilter] = React.useState<AuditEntry["actorRole"] | "all">("all");

  const filteredEntries = entries.filter((entry) => {
    if (filter !== "all" && entry.action !== filter) return false;
    if (roleFilter !== "all" && entry.actorRole !== roleFilter) return false;
    return true;
  });

  return (
    <div className={cn("space-y-4", className)}>
      {showFilters && (
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AuditEntry["action"] | "all")}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="all">All Actions</option>
            {Object.entries(actionConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as AuditEntry["actorRole"] | "all")}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="all">All Roles</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="paramedic">Paramedic</option>
            <option value="system">System</option>
          </select>
        </div>
      )}

      <div className="space-y-2">
        {filteredEntries.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No audit entries found</p>
        ) : (
          filteredEntries.map((entry) => (
            <AuditEntryRow key={entry.id} entry={entry} onViewDetails={onViewDetails} />
          ))
        )}
      </div>
    </div>
  );
}

function AuditEntryRow({
  entry,
  onViewDetails,
}: {
  entry: AuditEntry;
  onViewDetails?: (entry: AuditEntry) => void;
}) {
  const config = actionConfig[entry.action];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors",
        entry.action === "emergency_access" && "border-red-200 bg-red-50/50"
      )}
      onClick={() => onViewDetails?.(entry)}
    >
      <div className={cn("p-2 rounded-lg", config.color)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{config.label}</span>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", roleColors[entry.actorRole])}>
            {entry.actorRole}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-0.5">
          <span className="font-medium">{entry.actorName || formatAddress(entry.actorId)}</span>
          {entry.recordTitle && (
            <>
              {" "}
              - <span className="text-gray-500">{entry.recordTitle}</span>
            </>
          )}
        </p>

        {entry.details && <p className="text-xs text-gray-500 mt-1">{entry.details}</p>}

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>{formatDate(entry.timestamp)}</span>
          {entry.txHash && (
            <span className="font-mono">{formatAddress(entry.txHash, 4)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact timeline view for sidebars
export function AuditTimeline({
  entries,
  maxItems = 5,
  onViewAll,
}: {
  entries: AuditEntry[];
  maxItems?: number;
  onViewAll?: () => void;
}) {
  const displayEntries = entries.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayEntries.map((entry, index) => {
        const config = actionConfig[entry.action];
        const Icon = config.icon;

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="relative">
              <div className={cn("p-1.5 rounded-full", config.color)}>
                <Icon className="h-3 w-3" />
              </div>
              {index < displayEntries.length - 1 && (
                <div className="absolute top-6 left-1/2 w-px h-6 bg-gray-200 -translate-x-1/2" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-3">
              <p className="text-sm font-medium">{config.label}</p>
              <p className="text-xs text-gray-500 truncate">
                {entry.actorName || formatAddress(entry.actorId)}
              </p>
              <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
            </div>
          </div>
        );
      })}

      {entries.length > maxItems && onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all {entries.length} entries
        </button>
      )}
    </div>
  );
}
