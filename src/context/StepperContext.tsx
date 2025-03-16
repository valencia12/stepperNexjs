"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { FormStep1Data, FormStep2Data, FormStep3Data } from "@/types/FormTypes";

interface StepperContextType {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    saveData: (step: number, data: FormStep1Data | FormStep2Data | FormStep3Data) => void;
    formData: {
        [key: string]: FormStep1Data | FormStep2Data | FormStep3Data;
    };
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

    const [formData, setFormData] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("formData") || JSON.stringify({
                step1: { nombre: "", switchState: false },
                step2: { email: "", switchState: false },
                step3: { telefono: "", switchState: false },
            }));
        }
        return {
            step1: { nombre: "", switchState: false },
            step2: { email: "", switchState: false },
            step3: { telefono: "", switchState: false },
        };
    });

    const [isStepCompleted, setIsStepCompleted] = useState<boolean[]>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("isStepCompleted") || "[false, false, false]");
        }
        return [false, false, false];
    });

    const [loading, setLoading] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("loading") || "false");
        }
        return false;
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("errorMessage") || "null");
        }
        return null;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("currentStep", JSON.stringify(currentStep));
            localStorage.setItem("formData", JSON.stringify(formData));
            localStorage.setItem("isStepCompleted", JSON.stringify(isStepCompleted));
            localStorage.setItem("loading", JSON.stringify(loading));
            localStorage.setItem("errorMessage", JSON.stringify(errorMessage));
        }
    }, [currentStep, formData, isStepCompleted, loading, errorMessage]);

    const nextStep = () => {
        setCurrentStep((prev) => (prev < 2 ? prev + 1 : prev));
    };

    const prevStep = () => {
        setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const saveData = (step: number, data: FormStep1Data | FormStep2Data | FormStep3Data) => {
        setFormData((prev: any) => {
            const newData = { ...prev, [`step${step + 1}`]: data };
            localStorage.setItem("formData", JSON.stringify(newData));
            return newData;
        });
    };

    const markStepCompleted = (step: number) => {
        setIsStepCompleted((prev) => {
            const newStatus = [...prev];
            newStatus[step] = true;
            localStorage.setItem("isStepCompleted", JSON.stringify(newStatus));
            return newStatus;
        });
    };

    return (
        <StepperContext.Provider
            value={{ currentStep, nextStep, prevStep, saveData, formData, isStepCompleted, markStepCompleted, loading, setLoading, errorMessage, setErrorMessage }}
        >
            {children}
        </StepperContext.Provider>
    );
}

export function useStepper() {
    const context = useContext(StepperContext);
    if (!context) throw new Error("useStepper must be used within a StepperProvider");
    return context;
}
