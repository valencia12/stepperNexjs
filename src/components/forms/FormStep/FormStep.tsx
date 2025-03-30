"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Switch,
    Flex,
} from "@chakra-ui/react";
import { DynamicFormData } from "@/types/FormTypes";
import { ComboBox } from "./ComboBox";

interface FormStepProps {
    onSubmit: (data: DynamicFormData) => void;
    defaultValues: DynamicFormData;
    fields: {
        name: string;
        label: string;
        type?: string;
        validation?: any;
        options?: string[];
        searchable?: boolean;
    }[];
}

export default function FormStep({ onSubmit, defaultValues, fields }: FormStepProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<DynamicFormData>({
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const renderField = (field: any) => {
        const error = errors[field.name]?.message;
        const type = field.type || "text";

        if (type === "switch") {
            return (
                <Flex
                    align="center"
                    justify="space-between"
                    w="100%"
                    mb={2}
                    p={2}
                    borderRadius="md"
                    bg="gray.50"
                >
                    <FormLabel htmlFor={field.name} mb="0">
                        {field.label}
                    </FormLabel>
                    <Switch
                        {...register(field.name, {
                            required: field.validation?.required,
                            onChange: (e) => setValue(field.name, e.target.checked),
                        })}
                        id={field.name}
                        colorScheme="blue"
                        size="md"
                    />
                </Flex>
            );
        }

        if (type === "combo") {
            return (
                <ComboBox
                    label={field.label}
                    name={field.name}
                    options={field.options || []}
                    error={error}
                    register={register}
                    setValue={setValue}
                    validation={field.validation}
                />
            );
        }

        return (
            <>
                <FormLabel>{field.label}</FormLabel>
                <Input {...register(field.name, field.validation)} type={type} />
            </>
        );
    };

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} id="form-step">
            {fields.map((field) => (
                <FormControl key={field.name} isInvalid={!!errors[field.name]} mb={4}>
                    {renderField(field)}
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
