class SessionsController < ApplicationController
  def index
    session_animals = Animal.generate_animal_array
    render json:session_animals, only: [:name, :species, :image, :id]
  end

  def update
    # receive animal hash via params
    current_animals = JSON.parse(params['currentAnimals'])
    new_tasks = Task.task_list(current_animals)
    print new_tasks
    render json:new_tasks
  end

  def leaderboard
    top_ten = Session.all
    top_ten = top_ten.sort_by { |session| session[:score] }
    render json:top_ten
  end

  def new_high_score
    # find the lowest high score
    top_ten = Session.all
    top_ten = top_ten.sort_by { |session| session[:score] }
    # drop that row from the table
    if top_ten.length >= 10
      top_ten[0].destroy
    end
    # create a new entry with provided params
    Session.create(
      username: params[:username],
      score: params[:score],
      difficulty: params[:difficulty]
    )
    top_ten = Session.all
    top_ten = top_ten.sort_by { |session| session[:score] }
    render json:top_ten
  end
end
