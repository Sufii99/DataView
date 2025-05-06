import React, { useEffect, useState } from "react"

export default function FlashNotification({ message, type = "notice", onClose }) {
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (message) {
      setShouldRender(true)
      requestAnimationFrame(() => setVisible(true)) // slide-in

      const timeout = setTimeout(() => {
        setVisible(false) // slide-out

        setTimeout(() => {
          setShouldRender(false)
          onClose?.()
        }, 500) // duración de la transición
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [message])

  if (!shouldRender) return null

  const wrapperStyles = `
    fixed top-[100px] left-2 z-[1000] max-w-[90%] space-y-2
    transition-all duration-500 ease-in-out
    transform ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
  `

  const typeStyles = {
    success: {
      bg: "bg-green-100 border-green-500 text-green-900",
      icon: "text-green-600"
    },
    notice: {
      bg: "bg-blue-100 border-blue-500 text-blue-900",
      icon: "text-blue-600"
    },
    alert: {
      bg: "bg-red-100 border-red-500 text-red-900",
      icon: "text-red-600"
    },
    warning: {
      bg: "bg-yellow-100 border-yellow-500 text-yellow-900",
      icon: "text-yellow-600"
    },
  }

  const { bg, icon } = typeStyles[type] || typeStyles.notice

  return (
    <div className={wrapperStyles}>
      <div
        className={`flash-alert border-l-4 p-2 pr-3 rounded-lg flex items-center shadow-md ${bg}`}
        role="alert"
      >
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 flex-shrink-0 mr-2 ${icon}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>

        <p className="text-xs font-semibold flex-1">{message}</p>

        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => {
              setShouldRender(false)
              onClose?.()
            }, 500)
          }}
          className="ml-2 p-1 rounded hover:bg-black/10 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
