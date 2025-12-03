// Script para limpiar localStorage y recargar datos frescos
// Ejecutar en la consola del navegador si los datos no se actualizan

console.log('🧹 Limpiando localStorage...');

// Limpiar todos los datos del sistema
localStorage.removeItem('vehicles');
localStorage.removeItem('clients');
localStorage.removeItem('sellers');
localStorage.removeItem('requests');
localStorage.removeItem('notifications');

console.log('✅ localStorage limpiado');
console.log('🔄 Recarga la página para cargar datos frescos');

// Opcional: Recargar automáticamente
// window.location.reload();
