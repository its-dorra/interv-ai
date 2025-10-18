import BackLink from "@/components/back-link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PricingTable from "@/services/clerk/components/pricing-table";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Upgrade | IntervAI",
  description: "Upgrade your IntervAI plan.",
};

export default function UpgradePage() {
  return (
    <div className="container mx-auto py-4 max-w-6xl">
      <div className="mb-6">
        <BackLink href="/app">Dashboard</BackLink>
      </div>
      <div className="space-y-16">
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>Plan Limit Reached</AlertTitle>
          <AlertDescription>
            You have reached the limit of the current plan. Please upgrade to
            continue using all features.
          </AlertDescription>
        </Alert>

        <PricingTable />
      </div>
    </div>
  );
}
