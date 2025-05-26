Rails.application.routes.draw do
  # Ruta de "Inicio"
  root "home#index"
  get "home/index"

  # Ruta de "Contacto" y envío del formulario
  get "/contact", to: "contact#contact_form"
  post "/contact", to: "contact#send_email"

  # Rutas de páginas estáticas ("Guía", "FAQ", "Términos y Condiciones", "Política de privacidad")
  get "/guide", to: "pages#guide"
  get "/faq", to: "pages#faq"
  get "/terms", to: "pages#terms"
  get "/privacy", to: "pages#privacy"

  # Uso de devise para autenticación de usuarios
  devise_for :users, controllers: {
    registrations: "users/registrations"
  }

  # Ruta de "Dashboard" (solo usuarios autenticados)
  authenticate :user do
    get "/dashboard", to: "dashboard#show"
  end

  # Rutas de gestón de archivos (solo usuarios autenticados)
  authenticate :user do
    resources :file_uploads, only: [ :index, :create, :destroy ]
  end

  # Ruta de "Administración" (solo para administradores)
  get "admin/panel", to: "admin#panel", as: :admin_panel
  # API de administración de usuarios
  namespace :api do
    namespace :admin do
      resources :users, only: [ :index, :destroy ] do
        collection do
          get :countries_distribution
          get :registration_stats
        end
      end
    end
  end

  # Ruta de gestión de cookies
  post "cookies/accept", to: "cookies#accept", as: :cookies_accept
end
