# BlueBlocks Healthcare Portals

Role-based healthcare portal system built on the BlueBlocks blockchain. Each portal provides a tailored interface for different healthcare roles.

## Architecture

```
healthcare-portals/
├── packages/
│   ├── ui/          # Shared UI components (React + Tailwind)
│   ├── auth/        # Authentication & RBAC permissions
│   └── contracts/   # Smart contract ABIs & hooks
├── apps/
│   ├── patient-portal/     # Port 3001 - Patient self-service
│   ├── doctor-portal/      # Port 3002 - Clinical workflow
│   ├── pharmacist-portal/  # Port 3003 - Rx verification & dispense
│   └── paramedic-portal/   # Port 3004 - Mobile-first EMS
```

## Portal Features by Role

| Feature | Patient | Doctor | Pharmacist | Paramedic |
|---------|---------|--------|------------|-----------|
| View own records | ✅ | - | - | - |
| View patient records | - | ✅ | Rx only | ✅ Emergency |
| Create records | Self-reported | ✅ | Dispense logs | Field notes |
| Grant access | ✅ | - | - | - |
| Write prescriptions | - | ✅ | - | - |
| Dispense medication | - | - | ✅ | - |
| Emergency override | - | ✅ | - | ✅ |

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all portals in development
pnpm dev

# Run specific portal
pnpm dev:patient    # http://localhost:3001
pnpm dev:doctor     # http://localhost:3002
pnpm dev:pharmacist # http://localhost:3003
pnpm dev:paramedic  # http://localhost:3004

# Build all
pnpm build

# Type check
pnpm typecheck
```

## Shared Packages

### @blueblocks/ui
Healthcare-specific UI components:
- `RecordViewer` - Display health records with role-based actions
- `AccessGrantCard` - Manage access permissions
- `AccessGrantForm` - Create new access grants
- `AuditLog` / `AuditTimeline` - View access history
- `WalletConnect` - Blockchain wallet integration
- `EmergencyAccessRequest` - Emergency access workflow

### @blueblocks/auth
Role-based access control:
- `AuthProvider` - React context for auth state
- `useAuth` - Hook for auth state and actions
- `RoleGuard` / `PermissionGuard` / `FeatureGuard` - Conditional rendering
- `hasPermission()` - Check specific permissions
- `getRoleFeatures()` - Get role feature flags

### @blueblocks/contracts
Smart contract integration:
- `useHealthRecords()` - CRUD operations for health records
- `usePrescriptions()` - Prescription management
- `useDispenseWorkflow()` - Pharmacist dispense flow
- ABIs for HealthRecords and Prescriptions contracts

## Permission System

Permissions are enforced at multiple levels:

1. **Smart Contract** - On-chain access control
2. **API Middleware** - Server-side permission checks
3. **UI Guards** - Role-based component rendering

```tsx
// Example: Only show for doctors
<RoleGuard roles={["doctor"]}>
  <PrescribeButton />
</RoleGuard>

// Example: Check specific permission
<PermissionGuard action="prescribe" resource="prescription">
  <PrescriptionForm />
</PermissionGuard>

// Example: Feature flag
<FeatureGuard feature="canEmergencyAccess">
  <EmergencyAccessButton />
</FeatureGuard>
```

## Emergency Access

Doctors and paramedics can request emergency access when normal consent isn't possible. All emergency access:
- Creates permanent blockchain audit record
- Requires medical justification
- Has time-limited duration
- Is visible to patient in audit log

## Development

```bash
# Add dependency to a package
pnpm --filter @blueblocks/ui add lucide-react

# Add dependency to an app
pnpm --filter patient-portal add date-fns

# Run command in all packages
pnpm -r exec -- npm outdated
```

## Environment Variables

Each app requires:
```env
NEXT_PUBLIC_BLUEBLOCKS_RPC_URL=http://localhost:8080
NEXT_PUBLIC_BLUEBLOCKS_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_CHAIN_ID=blueblocks-devnet
```

## License

Proprietary - BlueBlocks Healthcare
