import { OnboardingProvider } from "@/context/onboarding-context";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-white text-neutral-900">
        {children}
      </div>
    </OnboardingProvider>
  );
}
