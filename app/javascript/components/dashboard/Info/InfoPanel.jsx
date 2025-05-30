import React from 'react';

const InfoPanel = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Información general</h1>

      {/* ¿Cómo funciona? */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">¿Cómo funciona el panel?</h2>
        <p className="text-gray-700">
          Este panel permite cargar archivos de datos, previsualizarlos
          y generar gráficas interactivas para analizarlos de forma visual y sencilla.
        </p>
      </section>

      {/* Tipos de gráficas */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tipos de gráficas soportadas</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Barras (agrupadas y apiladas)</li>
          <li>Líneas</li>
          <li>Circular (tarta)</li>
        </ul>
      </section>

      {/* Consejos para preparar los datos */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Consejos para preparar tus datos</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Usa encabezados claros en tus columnas (como “Producto”, “Ventas”, “Fecha”...)</li>
          <li>No dejes filas vacías.</li>
          <li>Los valores numéricos deben estar sin símbolos (por ejemplo, sin € ni %).</li>
          <li>Los datos deben estar organizados en columnas: cada columna representa una categoría o un valor.</li>
        </ul>
      </section>

      {/* Reglas para generar gráficas */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reglas básicas para crear gráficas</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Selecciona siempre una columna de texto para el eje X (como nombres o categorías).</li>
          <li>Selecciona solo columnas numéricas para el eje Y (valores como cantidades, porcentajes, etc.).</li>
          <li>No es posible graficar dos columnas de texto a la vez (como "Provincia" y "Nombre").</li>
          <li>Si tus datos tienen fechas, asegúrate de que estén en formato correcto (por ejemplo, <code>2023-05-01</code>).</li>
        </ul>
      </section>

      {/* Qué hacer si hay errores */}
      <section>
        <h2 className="text-xl font-semibold mb-2">¿Qué hacer si algo no funciona?</h2>
        <p className="text-gray-700">
          Si al intentar crear una gráfica no se muestra nada, revisa que:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Has seleccionado al menos una columna de texto y una numérica.</li>
          <li>Tu archivo no tiene errores de formato.</li>
          <li>No hay celdas vacías en las columnas seleccionadas.</li>
        </ul>
      </section>
    </div>
  );
};

export default InfoPanel;
