class SessionsController < ApplicationController
  def index
    session_animals = Animal.generate_animal_array
    # task_list = Task.task_list(session_animals)
    render json:session_animals, only: [:name, :species, :image]
  end
end
