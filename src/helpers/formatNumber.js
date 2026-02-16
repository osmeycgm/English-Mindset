// src/utils/formatNumber.js
export const formatNumber = (number) => {
  return (number || 25000).toLocaleString('es-CL');
};