import { OnboardingProvider } from "@/context/onboarding-context";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-[#080808] text-white">
        {children}
      </div>
    </OnboardingProvider>
  );
}
