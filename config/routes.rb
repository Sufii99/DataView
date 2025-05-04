Rails.application.routes.draw do
  root "home#index"
  get "home/index"

  devise_for :users

  get "/contact", to: "contact#contact_form"

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
end
