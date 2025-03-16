"use client";  // Necesario para evitar problemas de SSR

import { Container } from "@chakra-ui/react";
import StepperComponent from "@/components/StepperComponent";

export default function App() {
    return (
        <Container maxW="container.md" py={10}>
            <StepperComponent />
        </Container>
    );
}
