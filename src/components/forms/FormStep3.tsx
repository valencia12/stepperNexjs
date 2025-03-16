"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Switch } from "@chakra-ui/react";
import { FormStep3Data } from "@/types/FormTypes";

interface FormStep3Props {
    onSubmit: (data: FormStep3Data) => void;
    defaultValues: FormStep3Data;
}

export default function FormStep3({ onSubmit, defaultValues }: FormStep3Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormStep3Data>({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.telefono}>
                <FormLabel>Teléfono</FormLabel>
                <Input
                    {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        minLength: { value: 8, message: "Debe tener al menos 8 dígitos" },
                        maxLength: { value: 12, message: "Debe tener máximo 12 dígitos" },
                    })}
                    placeholder="Ingrese su teléfono"
                    type="tel"
                />
                <FormErrorMessage>{errors.telefono?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Activar opción</FormLabel>
                <Switch
                    {...register("switchState")}
                    isChecked={watch("switchState")}
                    onChange={(e) => setValue("switchState", e.target.checked)}
                />
            </FormControl>

            <Button type="submit" mt={4} colorScheme="blue">
                Finalizar
            </Button>
        </Box>
    );
}
