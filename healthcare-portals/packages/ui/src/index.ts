// Core components
export { Button, buttonVariants, type ButtonProps } from "./components/Button";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/Card";

// Healthcare components
export { RecordViewer, type HealthRecord, type RecordViewerProps } from "./components/RecordViewer";
export {
  AccessGrantCard,
  AccessGrantForm,
  type AccessGrant,
  type AccessGrantCardProps,
  type AccessGrantFormProps,
} from "./components/AccessGrant";
export {
  AuditLog,
  AuditTimeline,
  type AuditEntry,
  type AuditLogProps,
} from "./components/AuditLog";
export {
  WalletConnect,
  WalletBadge,
  type WalletState,
  type WalletConnectProps,
} from "./components/WalletConnect";
export {
  EmergencyAccessRequest,
  EmergencyAccessBanner,
  type EmergencyAccessProps,
} from "./components/EmergencyAccess";

// Utilities
export { cn, formatAddress, formatDate, formatRelativeTime } from "./lib/utils";
