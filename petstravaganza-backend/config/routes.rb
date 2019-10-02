Rails.application.routes.draw do
  get '/sessions/leaderboard', to: 'sessions#leaderboard'
  post '/sessions/new_high_score', to: 'sessions#new_high_score'
  resources :sessions
  resources :tasks
  resources :animals
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
