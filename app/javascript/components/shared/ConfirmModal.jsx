import React from "react"

export default function ConfirmModal({
  open,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">{title}</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
