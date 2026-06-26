"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface OnboardingData {
  directions: string[];
  challenges: string[];
  situation: string;
  timePerWeek: string;
  successGoal: string;
  customGoal: string;
  personalContext: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  toggleDirection: (value: string) => void;
  toggleChallenge: (value: string) => void;
}

const defaultData: OnboardingData = {
  directions: [],
  challenges: [],
  situation: "",
  timePerWeek: "",
  successGoal: "",
  customGoal: "",
  personalContext: "",
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultData,
  setField: () => {},
  toggleDirection: () => {},
  toggleChallenge: () => {},
});

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const setField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleDirection = (value: string) => {
    setData(prev => ({
      ...prev,
      directions: prev.directions.includes(value)
        ? prev.directions.filter(d => d !== value)
        : [...prev.directions, value],
    }));
  };

  const toggleChallenge = (value: string) => {
    setData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(value)
        ? prev.challenges.filter(c => c !== value)
        : [...prev.challenges, value],
    }));
  };

  return (
    <OnboardingContext.Provider value={{ data, setField, toggleDirection, toggleChallenge }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
