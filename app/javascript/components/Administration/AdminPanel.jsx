import React, { useEffect, useState } from "react"
import FlashNotification from "../shared/FlashNotification"
import ConfirmModal from "../shared/ConfirmModal"
import RoleDistributionChart from "./RoleDistributionChart"
import WorldMapChart from "./WorldMapChart"
import UserRegistrationChart from "./UserRegistrationChart"

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState({ message: null, type: "notice" })
  const [modalOpen, setModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [countryStats, setCountryStats] = useState({})

  useEffect(() => {
    fetchUsers()
    fetchCountryStats()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/users")
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  const fetchCountryStats = async () => {
    const res = await fetch("/api/admin/users/countries_distribution")
    const data = await res.json()
    setCountryStats(data)
  }

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
    })

    const data = await res.json()

    if (res.ok) {
      setUsers(users.filter((user) => user.id !== id))
      setFlash({ message: data.message || "Usuario eliminado", type: "success" })
    } else {
      setFlash({ message: data.error || "Error al eliminar el usuario", type: "alert" })
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <FlashNotification
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: null, type: "notice" })}
      />

      <div className="min-h-screen bg-gray-100 py-10 px-4 pt-30 flex justify-center">
        <div className="w-full max-w-7xl flex flex-col gap-8">

          {/* Card: Panel de usuarios */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Panel de administración</h1>
              <input
                type="text"
                placeholder="Buscar por email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <p className="text-gray-500 text-sm">Cargando usuarios...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-4">Nombre</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Rol</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{user.first_name} {user.last_name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4 text-center">
                          {user.admin ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Admin</span>
                          ) : (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">Usuario</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setUserToDelete(user.id)
                              setModalOpen(true)
                            }}
                            className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md transition cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Gráfica de Roles de usuario y usuarios registrados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleDistributionChart users={users} />
            <UserRegistrationChart />
          </div>

          {/* Gráfica de Distribución de usuarios por país */}
          <WorldMapChart countryData={countryStats} />

        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        title="¿Eliminar usuario?"
        message="Esta acción eliminará permanentemente al usuario."
        onCancel={() => {
          setModalOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={() => {
          handleDelete(userToDelete)
          setModalOpen(false)
          setUserToDelete(null)
        }}
      />
    </>
  )
}

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]').content
}
