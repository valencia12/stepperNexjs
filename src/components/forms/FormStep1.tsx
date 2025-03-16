"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Switch } from "@chakra-ui/react";
import { FormStep1Data } from "@/types/FormTypes";

interface FormStep1Props {
    onSubmit: (data: FormStep1Data) => void;
    defaultValues: FormStep1Data;
}

export default function FormStep1({ onSubmit, defaultValues }: FormStep1Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormStep1Data>({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.nombre}>
                <FormLabel>Nombre</FormLabel>
                <Input
                    {...register("nombre", {
                        required: "El nombre es obligatorio",
                        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                    })}
                    placeholder="Ingrese su nombre"
                />
                <FormErrorMessage>{errors.nombre?.message}</FormErrorMessage>
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
                Continuar
            </Button>
        </Box>
    );
}
