"use client";

import { useStepper } from "@/context/StepperContext";
import { Box, Button, Step, StepIndicator, StepSeparator, StepStatus, StepTitle, StepDescription, Stepper, Text, Spinner } from "@chakra-ui/react";
import FormStep1 from "@/components/forms/FormStep1";
import FormStep2 from "@/components/forms/FormStep2";
import FormStep3 from "@/components/forms/FormStep3";
import { FormStep1Data, FormStep2Data, FormStep3Data } from "@/types/FormTypes";
import { fakeApiRequest } from "@/utils/api";
import { useState } from "react";

const formsConfig = [
  { title: "Paso 1", description: "Información básica", component: FormStep1 },
  { title: "Paso 2", description: "Detalles adicionales", component: FormStep2 },
  { title: "Paso 3", description: "Confirmación", component: FormStep3 },
];

export default function StepperComponent() {
  const { currentStep, nextStep, prevStep, saveData, formData, isStepCompleted, markStepCompleted, loading, setLoading, setErrorMessage } = useStepper();
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);
  const [errorStepIndex, setErrorStepIndex] = useState<number | null>(null);

  const handleNext = async (data: FormStep1Data | FormStep2Data | FormStep3Data) => {
    saveData(currentStep, data);
    setLoading(true);
    setLocalErrorMessage(null);
    setErrorStepIndex(null);

    const response = await fakeApiRequest(data);

    setLoading(false);
    if (response.success) {
      markStepCompleted(currentStep);
      setLocalErrorMessage(null);
      nextStep();
    } else {
      setLocalErrorMessage(response.message || "Hubo un problema. Inténtalo de nuevo.");
      setErrorStepIndex(currentStep);
    }
  };

  const formKey = `step${currentStep + 1}` as keyof typeof formData;
  const FormComponent = formsConfig[currentStep].component;

  return (
    <Box width="500px" mx="auto" mt={10}>
      <Stepper index={currentStep}>
        {formsConfig.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={isStepCompleted[index] ? "✅" : "⚪"} incomplete={"⚪"} active={"🔵"} />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {/* Mostrar el error arriba del formulario si existe y pertenece al paso actual */}
      {errorStepIndex === currentStep && localErrorMessage && (
        <Text color="red.500" bg="red.100" p={2} borderRadius="md" mt={4} textAlign="center">
          {localErrorMessage}
        </Text>
      )}

      <Box mt={5} p={5} border="1px solid #ddd" borderRadius="md">
        <FormComponent onSubmit={handleNext} defaultValues={formData[formKey] as any} />
      </Box>

      <Box mt={5} display="flex" justifyContent="space-between">
        <Button onClick={prevStep} isDisabled={currentStep === 0 || loading}>
          Atrás
        </Button>
        <Button onClick={() => { }} isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : "Siguiente"}
        </Button>
      </Box>
    </Box>
  );
}
