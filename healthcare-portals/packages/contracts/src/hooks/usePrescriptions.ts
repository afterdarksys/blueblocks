"use client";

import * as React from "react";
import type { Prescription, DispenseRecord, Medication } from "../abis/Prescriptions";

interface ContractClient {
  call: (fn: string, args: unknown[]) => Promise<unknown>;
}

interface UsePrescriptionsOptions {
  client: ContractClient;
  contractAddress: string;
}

export function usePrescriptions({ client, contractAddress }: UsePrescriptionsOptions) {
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

  // Create prescription (doctor only)
  const createPrescription = React.useCallback(
    async (
      patientId: string,
      medication: Medication,
      dosage: string,
      frequency: string,
      durationDays: number,
      refills: number,
      notes?: string
    ): Promise<string> => {
      return callContract<string>("create_prescription", [
        patientId,
        medication,
        dosage,
        frequency,
        durationDays,
        refills,
        notes,
      ]);
    },
    [callContract]
  );

  // Get prescription details
  const getPrescription = React.useCallback(
    async (prescriptionId: string): Promise<Prescription> => {
      return callContract<Prescription>("get_prescription", [prescriptionId]);
    },
    [callContract]
  );

  // List patient prescriptions
  const listPatientPrescriptions = React.useCallback(
    async (patientId: string, status?: string): Promise<Prescription[]> => {
      return callContract<Prescription[]>("list_patient_prescriptions", [patientId, status]);
    },
    [callContract]
  );

  // Dispense medication (pharmacist only)
  const dispense = React.useCallback(
    async (
      prescriptionId: string,
      quantity: number,
      pharmacyId: string,
      notes?: string
    ): Promise<string> => {
      return callContract<string>("dispense", [prescriptionId, quantity, pharmacyId, notes]);
    },
    [callContract]
  );

  // Get dispense history
  const getDispenseHistory = React.useCallback(
    async (prescriptionId: string): Promise<DispenseRecord[]> => {
      return callContract<DispenseRecord[]>("get_dispense_history", [prescriptionId]);
    },
    [callContract]
  );

  // Cancel prescription (prescriber only)
  const cancelPrescription = React.useCallback(
    async (prescriptionId: string, reason: string): Promise<void> => {
      await callContract<void>("cancel_prescription", [prescriptionId, reason]);
    },
    [callContract]
  );

  // Verify prescription
  const verifyPrescription = React.useCallback(
    async (
      prescriptionId: string
    ): Promise<{
      valid: boolean;
      prescriber_verified: boolean;
      not_expired: boolean;
      refills_remaining: number;
    }> => {
      return callContract("verify_prescription", [prescriptionId]);
    },
    [callContract]
  );

  return {
    isLoading,
    error,
    createPrescription,
    getPrescription,
    listPatientPrescriptions,
    dispense,
    getDispenseHistory,
    cancelPrescription,
    verifyPrescription,
  };
}

// Hook for pharmacist dispense workflow
export function useDispenseWorkflow(
  client: ContractClient,
  contractAddress: string,
  prescriptionId: string | null
) {
  const [prescription, setPrescription] = React.useState<Prescription | null>(null);
  const [verification, setVerification] = React.useState<{
    valid: boolean;
    prescriber_verified: boolean;
    not_expired: boolean;
    refills_remaining: number;
  } | null>(null);
  const [dispenseHistory, setDispenseHistory] = React.useState<DispenseRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const { getPrescription, verifyPrescription, getDispenseHistory, dispense } = usePrescriptions({
    client,
    contractAddress,
  });

  // Load prescription data
  const loadPrescription = React.useCallback(async () => {
    if (!prescriptionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const [rx, verify, history] = await Promise.all([
        getPrescription(prescriptionId),
        verifyPrescription(prescriptionId),
        getDispenseHistory(prescriptionId),
      ]);
      setPrescription(rx);
      setVerification(verify);
      setDispenseHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load prescription"));
    } finally {
      setIsLoading(false);
    }
  }, [prescriptionId, getPrescription, verifyPrescription, getDispenseHistory]);

  React.useEffect(() => {
    loadPrescription();
  }, [loadPrescription]);

  // Dispense and refresh
  const dispenseMedication = React.useCallback(
    async (quantity: number, pharmacyId: string, notes?: string) => {
      if (!prescriptionId) throw new Error("No prescription selected");

      const dispenseId = await dispense(prescriptionId, quantity, pharmacyId, notes);
      await loadPrescription(); // Refresh data after dispense
      return dispenseId;
    },
    [prescriptionId, dispense, loadPrescription]
  );

  return {
    prescription,
    verification,
    dispenseHistory,
    isLoading,
    error,
    refresh: loadPrescription,
    dispenseMedication,
  };
}
