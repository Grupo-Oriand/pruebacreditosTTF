// Usuarios de prueba para el sistema
// En producción, esto vendría de una base de datos con autenticación real

export const mockUsers = [
    // Concesionario
    {
        id: 1,
        username: 'dealer1',
        password: 'dealer123',
        email: 'dealer@autoventas.com',
        fullName: 'Carlos Rodríguez',
        role: 'dealer',
        companyName: 'AutoVentas Premium',
        phone: '+57 300 123 4567'
    },

    // Cliente
    {
        id: 2,
        username: 'cliente1',
        password: 'cliente123',
        email: 'juan.perez@email.com',
        fullName: 'Juan Pérez',
        role: 'client',
        phone: '+57 310 987 6543',
        idNumber: '1234567890'
    },

    // Institución Financiera
    {
        id: 3,
        username: 'banco1',
        password: 'banco123',
        email: 'creditos@bancolombia.com',
        fullName: 'María González',
        role: 'financial',
        companyName: 'Bancolombia',
        phone: '+57 320 456 7890',
        position: 'Analista de Crédito'
    },

    // Otra Institución Financiera
    {
        id: 4,
        username: 'financiera1',
        password: 'financiera123',
        email: 'creditos@davivienda.com',
        fullName: 'Andrea Martínez',
        role: 'financial',
        companyName: 'Davivienda',
        phone: '+57 315 789 0123',
        position: 'Gerente de Créditos'
    }
];

// Función para autenticar usuario
export const authenticateUser = (username, password) => {
    const user = mockUsers.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // No devolvemos la contraseña por seguridad
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
};

// Función para obtener usuario por username (sin contraseña)
export const getUserByUsername = (username) => {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};
