export const fakeApiRequest = async (data: any): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // 70% de éxito, 30% de fallo
            if (isSuccess) {
                resolve({ success: true });
            } else {
                resolve({ success: false, message: "Error en el servidor. Inténtelo de nuevo." });
            }
        }, 2000); // Simula un tiempo de respuesta de 2 segundos
    });
};
