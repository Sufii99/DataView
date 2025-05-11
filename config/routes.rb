Rails.application.routes.draw do
  root "home#index"
  get "home/index"

  devise_for :users

  get "/contact", to: "contact#contact_form"
  post "/contacto", to: "contact#send_email"

  authenticate :user do
    get "/dashboard", to: "dashboard#show"
  end

  authenticate :user do
    resources :file_uploads, only: [ :index, :create, :destroy ]
  end

  get "/guide", to: "pages#guide"
  get "/faq", to: "pages#faq"
  get "/terms", to: "pages#terms"
  get "/privacy", to: "pages#privacy"

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

  get "admin/panel", to: "admin#panel", as: :admin_panel

  post "cookies/accept", to: "cookies#accept", as: :cookies_accept
end
