import React from 'react';

const InfoPanel = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Información general</h1>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">¿Cómo funciona el panel?</h2>
        <p className="text-gray-700">
          Este panel permite cargar archivos de datos, previsualizarlos y generar gráficas interactivas.
        </p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Tipos de gráficas soportadas</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Barras (agrupadas y apiladas)</li>
          <li>Líneas</li>
          <li>Circular (tarta)</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Consejos para preparar tus datos</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Usa encabezados claros en tus columnas.</li>
          <li>Asegúrate de no tener filas vacías.</li>
          <li>Los valores numéricos deben estar en formato estándar (sin símbolos o letras).</li>
        </ul>
      </section>
    </div>
  );
};

export default InfoPanel;
