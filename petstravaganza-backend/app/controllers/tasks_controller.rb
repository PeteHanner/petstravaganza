class TasksController < ApplicationController
  def index
    tasks = Task.task_list
    render json:tasks, only:[:activity, :status, :duration, :image], include: [animal: {only: [:name, :species, :image]}]
  end
end
