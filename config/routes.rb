Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token
  resources :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root "pages#index"

  resource :greets, only: [ :show ]
  resources :dashboard, only: [ :index ] do
    collection do
      get :settings
    end
  end
  resources :projects do
    collection do
      get :add_task
    end
    member do
      patch :sort_tasks
    end
  end
end
