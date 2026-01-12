// Script de utilidad para limpiar datos antiguos manualmente
// Ejecuta esto en la consola del navegador si necesitas forzar la limpieza

export const clearOldData = () => {
    console.log('🧹 Limpiando datos antiguos...');
    localStorage.clear();
    console.log('✅ Datos limpiados. Recargando página...');
    window.location.reload();
};

export const checkDataVersion = () => {
    const version = localStorage.getItem('dataVersion');
    console.log('📊 Versión actual de datos:', version || 'No definida');

    const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    console.log('🚗 Vehículos en localStorage:', vehicles);

    const nonToyota = vehicles.filter(v => v.make !== 'Toyota');
    if (nonToyota.length > 0) {
        console.warn('⚠️ Se encontraron vehículos no-Toyota:', nonToyota);
        console.log('💡 Ejecuta clearOldData() para limpiar');
    } else {
        console.log('✅ Todos los vehículos son Toyota');
    }
};

export const resetToDefaults = () => {
    console.log('🔄 Reseteando a valores por defecto...');
    localStorage.setItem('dataVersion', '2.0-toyota-only');
    localStorage.removeItem('vehicles');
    localStorage.removeItem('requests');
    localStorage.removeItem('notifications');
    console.log('✅ Reset completo. Recargando...');
    window.location.reload();
};

// Hacer funciones disponibles globalmente en desarrollo
if (typeof window !== 'undefined') {
    window.clearOldData = clearOldData;
    window.checkDataVersion = checkDataVersion;
    window.resetToDefaults = resetToDefaults;
}

console.log('🛠️ Utilidades de datos cargadas. Comandos disponibles:');
console.log('  - clearOldData() - Limpiar todos los datos');
console.log('  - checkDataVersion() - Verificar versión de datos');
console.log('  - resetToDefaults() - Resetear a valores por defecto');
