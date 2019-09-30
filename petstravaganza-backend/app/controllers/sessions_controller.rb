class SessionsController < ApplicationController
  def index
    session_animals = Animal.generate_animal_array
    # task_list = Task.task_list(session_animals)
    render json:session_animals, only: [:name, :species, :image, :id]
  end

  def update
    # receive animal hash via params
    current_animals = JSON.parse(params['currentAnimals'])
    puts current_animals
    new_tasks = Task.task_list(current_animals)
    print new_tasks
    render json:new_tasks
    # byebug
    # 0
    # create 15 tasks associated with those animals
    # return as JSON object
  end
end
