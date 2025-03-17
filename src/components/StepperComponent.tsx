"use client";

import { useStepper } from "@/context/StepperContext";
import { Box, Button, Step, StepIndicator, StepSeparator, StepStatus, StepTitle, StepDescription, Stepper, Text, Spinner } from "@chakra-ui/react";
import { fakeApiRequest } from "@/utils/api";
import { useState } from "react";
import FormStep from "@/components/forms/FormStep/FormStep"; // Importamos el formulario dinámico

const formsConfig = [
  {
    title: "Paso 1",
    description: "Información básica",
    fields: [
      { name: "nombre", label: "Nombre", validation: { required: "El nombre es obligatorio" } },
      { name: "apellido", label: "Apellido", validation: { required: "El apellido es obligatorio" } },
      { name: "edad", label: "Edad", type: "number", validation: { 
          required: "La edad es obligatoria", 
          min: { value: 18, message: "Debes ser mayor de edad" }, 
          max: { value: 100, message: "Debe ser menor a 100" } 
        } 
      },
      { name: "recibirNoticias", label: "¿Deseas recibir noticias?", type: "switch" },
    ],
  },
  {
    title: "Paso 2",
    description: "Detalles adicionales",
    fields: [
      { name: "email", label: "Email", type: "email", validation: { 
          required: "El email es obligatorio", 
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email no válido" } 
        } 
      },
      { name: "telefono", label: "Teléfono", type: "tel", validation: { 
          required: "El teléfono es obligatorio", 
          pattern: { value: /^[0-9]{10}$/, message: "Debe ser un número de 10 dígitos" } 
        } 
      },
      { name: "pais", label: "País", validation: { required: "El país es obligatorio" } },
      { name: "notificacionesSMS", label: "¿Recibir notificaciones por SMS?", type: "switch", validation: { required: "El país es obligatorio" }  },
    ],
  },
  {
    title: "Paso 3",
    description: "Confirmación",
    fields: [
      { name: "direccion", label: "Dirección", validation: { required: "La dirección es obligatoria" } },
      { name: "codigoPostal", label: "Código Postal", validation: { 
          required: "El código postal es obligatorio", 
          pattern: { value: /^[0-9]{5}$/, message: "Debe ser un código postal de 5 dígitos" } 
        } 
      },
      { name: "aceptarTerminos", label: "Aceptar términos", type: "checkbox", validation: { required: "Debes aceptar los términos" } },
      { name: "ofertasEmail", label: "¿Deseas recibir ofertas por email?", type: "switch" },
    ],
  },
];


export default function StepperComponent() {
  const { currentStep, nextStep, prevStep, saveData, formData, isStepCompleted, markStepCompleted, loading, setLoading } = useStepper();
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);
  const [errorStepIndex, setErrorStepIndex] = useState<number | null>(null);

  const handleNext = async (data: Record<string, any>) => {
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
  const { fields } = formsConfig[currentStep]; // Extraemos los campos dinámicamente

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

      {errorStepIndex === currentStep && localErrorMessage && (
        <Text color="red.500" bg="red.100" p={2} borderRadius="md" mt={4} textAlign="center">
          {localErrorMessage}
        </Text>
      )}

      <Box mt={5} p={5} border="1px solid #ddd" borderRadius="md">
        <FormStep onSubmit={handleNext} defaultValues={formData[formKey] || {}} fields={fields} />
      </Box>

      <Box mt={5} display="flex" justifyContent="space-between">
        <Button onClick={prevStep} isDisabled={currentStep === 0 || loading}>
          Atrás
        </Button>
        <Button type="submit" form="form-step" isDisabled={loading}>
          {loading ? <Spinner size="sm" /> : "Siguiente"}
        </Button>
      </Box>
    </Box>
  );
}
