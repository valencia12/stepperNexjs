"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DynamicFormData } from "@/types/FormTypes";

interface StepperContextType {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    saveData: (step: number, data: DynamicFormData) => void;
    formData: { [key: string]: DynamicFormData };
    isStepCompleted: boolean[];
    markStepCompleted: (step: number) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    errorMessage: string | null;
    setErrorMessage: (value: string | null) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function StepperProvider({ children }: { children: React.ReactNode }) {
    const [currentStep, setCurrentStep] = useState<number>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("currentStep") || "0");
        }
        return 0;
    });

    const [formData, setFormData] = useState<{ [key: string]: DynamicFormData }>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("formData") || JSON.stringify({}));
        }
        return {};
    });

    const [isStepCompleted, setIsStepCompleted] = useState<boolean[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("isStepCompleted") || "[false, false, false]");
        }
        return [false, false, false];
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("currentStep", JSON.stringify(currentStep));
            localStorage.setItem("formData", JSON.stringify(formData));
            localStorage.setItem("isStepCompleted", JSON.stringify(isStepCompleted));
        }
    }, [currentStep, formData, isStepCompleted]);

    const nextStep = () => {
        setCurrentStep((prev) => (prev < 2 ? prev + 1 : prev));
    };

    const prevStep = () => {
        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const saveData = (step: number, data: DynamicFormData) => {
        setFormData((prev) => {
            const newData = { ...prev, [`step${step + 1}`]: data };
            localStorage.setItem("formData", JSON.stringify(newData));
            return newData;
        });
    };

    const markStepCompleted = (step: number) => {
        setIsStepCompleted((prev) => {
            const newStatus = [...prev];
            newStatus[step] = true;
            return newStatus;
        });
    };

    return (
        <StepperContext.Provider value={{ currentStep, nextStep, prevStep, saveData, formData, isStepCompleted, markStepCompleted, loading, setLoading, errorMessage, setErrorMessage }}>
            {children}
        </StepperContext.Provider>
    );
}

export function useStepper() {
    const context = useContext(StepperContext);
    if (!context) throw new Error("useStepper must be used within a StepperProvider");
    return context;
}
