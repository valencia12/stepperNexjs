"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Switch } from "@chakra-ui/react";
import { FormStep2Data } from "@/types/FormTypes";

interface FormStep2Props {
    onSubmit: (data: FormStep2Data) => void;
    defaultValues: FormStep2Data;
}

export default function FormStep2({ onSubmit, defaultValues }: FormStep2Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormStep2Data>({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                    {...register("email", {
                        required: "El email es obligatorio",
                        pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" },
                    })}
                    placeholder="Ingrese su email"
                    type="email"
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
