Rails.application.routes.draw do
  root "posts#index"
  resources :posts
  delete 'posts/:id/file_attachments/:blob_id', to: 'posts#delete_file_attachment', as: :delete_post_file_attachment
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
