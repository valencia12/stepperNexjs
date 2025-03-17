export interface FormStep1Data {
    nombre: string;
    switchState: boolean;
}

export interface FormStep2Data {
    email: string;
    switchState: boolean;
}

export interface FormStep3Data {
    telefono: string;
    switchState: boolean;
}
export type DynamicFormData = Record<string, any>;