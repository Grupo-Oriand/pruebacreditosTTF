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

    // Institución Financiera - PIVCA
    {
        id: 3,
        username: 'analista_pivca',
        password: 'pivca123',
        email: 'creditos@pivca.com',
        fullName: 'María González',
        role: 'financial',
        companyName: 'PIVCA',
        phone: '+58 414 123 4567',
        position: 'Analista de Crédito Senior'
    },

    // Institución Financiera - FIVENCA
    {
        id: 4,
        username: 'analista_fivenca',
        password: 'fivenca123',
        email: 'analisis@fivenca.com',
        fullName: 'Alejandro Mendoza',
        role: 'financial',
        companyName: 'FIVENCA',
        phone: '+58 412 987 6543',
        position: 'Gerente de Riesgo'
    },

    // Institución Financiera - ARCA
    {
        id: 7,
        username: 'analista_arca',
        password: 'arca123',
        email: 'riesgo@arca.com',
        fullName: 'Patricia Elena Torres',
        role: 'financial',
        companyName: 'ARCA',
        phone: '+58 424 555 8899',
        position: 'Coordinadora de Créditos'
    },

    // Gerente de Concesionario
    {
        id: 5,
        username: 'gerente1',
        password: 'gerente123',
        email: 'gerente@autoventas.com',
        fullName: 'Roberto Gómez',
        role: 'dealer_manager',
        companyName: 'AutoVentas Premium',
        phone: '+57 300 999 8888'
    },

    // Vendedor
    {
        id: 6,
        username: 'vendedor1',
        password: 'vendedor123',
        email: 'vendedor@autoventas.com',
        fullName: 'Ana López',
        role: 'seller',
        companyName: 'AutoVentas Premium',
        phone: '+57 300 777 6666'
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
