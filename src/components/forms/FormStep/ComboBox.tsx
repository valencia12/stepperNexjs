import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input,
    Button,
    Text
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface ComboBoxProps {
    label: string;
    value?: string | number;
    name: string;
    options: string[];
    error?: any;
    register: any;
    setValue: any;
    validation?: any;
}

export const ComboBox = ({
    label,
    name,
    options,
    error,
    register,
    setValue,
    validation,
}: ComboBoxProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (value: string) => {
        setValue(name, value);
        setSelectedLabel(value);
        setSearchTerm("");
    };

    return (
        <FormControl isInvalid={!!error} mb={4}>
            <FormLabel htmlFor={name}>{label}</FormLabel>

            <Menu isLazy matchWidth autoSelect={false}>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%" textAlign="left">
                    {selectedLabel || "Seleccione una opción"}
                </MenuButton>
                <MenuList maxHeight="250px" overflowY="auto" px={2}>
                    <Input
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        mb={2}
                        size="sm"
                        variant="filled"
                    />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, idx) => (
                            <MenuItem key={idx} onClick={() => handleSelect(option)}>
                                {option}
                            </MenuItem>
                        ))
                    ) : (
                        <Box px={3} py={2}>
                            <Text fontSize="sm" color="gray.500">
                                No hay resultados
                            </Text>
                        </Box>
                    )}
                </MenuList>
            </Menu>

            <input type="hidden" {...register(name, validation)} />

            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};
