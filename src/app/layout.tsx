"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { StepperProvider } from "@/context/StepperContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <ChakraProvider>
                    <StepperProvider>{children}</StepperProvider>
                </ChakraProvider>
            </body>
        </html>
    );
}
