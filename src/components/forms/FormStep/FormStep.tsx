"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Switch, Flex } from "@chakra-ui/react";
import { DynamicFormData } from "@/types/FormTypes";

interface FormStepProps {
    onSubmit: (data: DynamicFormData) => void;
    defaultValues: DynamicFormData;
    fields: { name: string; label: string; type?: string; validation?: any }[];
}

export default function FormStep({ onSubmit, defaultValues, fields }: FormStepProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<DynamicFormData>({
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} id="form-step">
            {fields.map((field) => (
                <FormControl key={field.name} isInvalid={!!errors[field.name]} mb={4}>
                    {field.type === "switch" ? (
                        <Flex align="center" justify="space-between" w="100%" mb={2} p={2} borderRadius="md" bg="gray.50">
                            <FormLabel htmlFor={field.name} mb="0">
                                {field.label}
                            </FormLabel>
                            <Switch
                                {...register(field.name, {
                                    required: field.validation?.required, // ✅ Asegura que los switches sean obligatorios si están en formsConfig
                                    onChange: (e) => setValue(field.name, e.target.checked),
                                })}
                                id={field.name}
                                colorScheme="blue"
                                size="md"
                            />
                        </Flex>
                    ) : (
                        <>
                            <FormLabel>{field.label}</FormLabel>
                            <Input {...register(field.name, field.validation)} type={field.type || "text"} />
                        </>
                    )}

                    <FormErrorMessage>
                        {errors[field.name]?.message ? String(errors[field.name]?.message) : ""}
                    </FormErrorMessage>
                </FormControl>
            ))}

            <Button type="submit" colorScheme="blue">
                Continuar
            </Button>
        </Box>
    );
}
