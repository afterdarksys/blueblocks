"use client";

import * as React from "react";
import type { HealthRecord, AccessGrant, AuditLogEntry, EmergencyAccess } from "../abis/HealthRecords";

// Mock client interface - replace with actual BlueBlocks SDK client
interface ContractClient {
  call: (fn: string, args: unknown[]) => Promise<unknown>;
  deploy: (code: string, initArgs: unknown[]) => Promise<string>;
}

interface UseHealthRecordsOptions {
  client: ContractClient;
  contractAddress: string;
}

export function useHealthRecords({ client, contractAddress }: UseHealthRecordsOptions) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const callContract = React.useCallback(
    async <T>(fn: string, args: unknown[] = []): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await client.call(fn, args);
        return result as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Contract call failed");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  // Record management
  const createRecord = React.useCallback(
    async (
      patientId: string,
      recordType: string,
      ipfsCid: string,
      metadata: Record<string, unknown>
    ): Promise<string> => {
      return callContract<string>("create_record", [patientId, recordType, ipfsCid, metadata]);
    },
    [callContract]
  );

  const getRecord = React.useCallback(
    async (recordId: string): Promise<HealthRecord> => {
      return callContract<HealthRecord>("get_record", [recordId]);
    },
    [callContract]
  );

  const listPatientRecords = React.useCallback(
    async (patientId: string, recordType?: string): Promise<HealthRecord[]> => {
      return callContract<HealthRecord[]>("list_patient_records", [patientId, recordType]);
    },
    [callContract]
  );

  // Access management
  const grantAccess = React.useCallback(
    async (
      granteeId: string,
      recordTypes: string[],
      expiresAt: number,
      reason?: string
    ): Promise<string> => {
      return callContract<string>("grant_access", [granteeId, recordTypes, expiresAt, reason]);
    },
    [callContract]
  );

  const revokeAccess = React.useCallback(
    async (grantId: string): Promise<void> => {
      await callContract<void>("revoke_access", [grantId]);
    },
    [callContract]
  );

  const checkAccess = React.useCallback(
    async (accessorId: string, patientId: string, recordType: string): Promise<boolean> => {
      return callContract<boolean>("check_access", [accessorId, patientId, recordType]);
    },
    [callContract]
  );

  // Emergency access
  const requestEmergencyAccess = React.useCallback(
    async (
      patientId: string,
      reason: string,
      urgencyLevel: "critical" | "urgent" | "standard"
    ): Promise<string> => {
      return callContract<string>("request_emergency_access", [patientId, reason, urgencyLevel]);
    },
    [callContract]
  );

  // Audit log
  const getAuditLog = React.useCallback(
    async (patientId: string, limit?: number, offset?: number): Promise<AuditLogEntry[]> => {
      return callContract<AuditLogEntry[]>("get_audit_log", [patientId, limit, offset]);
    },
    [callContract]
  );

  return {
    isLoading,
    error,
    // Records
    createRecord,
    getRecord,
    listPatientRecords,
    // Access
    grantAccess,
    revokeAccess,
    checkAccess,
    // Emergency
    requestEmergencyAccess,
    // Audit
    getAuditLog,
  };
}

// Hook for fetching and caching patient records
export function usePatientRecords(
  client: ContractClient,
  contractAddress: string,
  patientId: string | null,
  recordType?: string
) {
  const [records, setRecords] = React.useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const { listPatientRecords } = useHealthRecords({ client, contractAddress });

  const refresh = React.useCallback(async () => {
    if (!patientId) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await listPatientRecords(patientId, recordType);
      setRecords(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch records"));
    } finally {
      setIsLoading(false);
    }
  }, [patientId, recordType, listPatientRecords]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { records, isLoading, error, refresh };
}
