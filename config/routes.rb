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
  resource :cookies, only: [] do
    collection do
      post :accept
      post :reject
    end
  end
end
