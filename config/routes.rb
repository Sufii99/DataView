Rails.application.routes.draw do
  # Ruta inicial
  root "home#index"
  get "home/index"

  # Ruta directa para un nuevo formulario de contacto
  resources :contact_form, only: %i[new create]
  Rails.application.routes.draw do
    get "contact", to: "contact_form#new", as: :contact
  end

  # Rutas para usar controladores personalizados de Devise
  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  # Rutas protegidas (solo accesibles si está autenticado)
  authenticated :user do
    get "subir_datos", to: "uploads#new", as: :subir_datos
    get "mis_archivos", to: "uploads#index", as: :mis_archivos
  end

  # Gestion de cookies
  post "cookies/accept", to: "cookies#accept"
  post "cookies/reject", to: "cookies#reject"
  get "cookies/preferences", to: "cookies#preferences", as: :cookie_preferences
  post "cookies/save_preferences", to: "cookies#save_preferences", as: :save_preferences_cookies

  # Ruta para paginas estaticas (sin logica)
  get "acerca", to: "static_pages#acerca"
  get "terminos", to: "static_pages#terms", as: :terms
  get "privacidad", to: "static_pages#privacy", as: :privacy
  get "politica-de-cookies", to: "static_pages#cookie_policy", as: :cookie_policy
end
