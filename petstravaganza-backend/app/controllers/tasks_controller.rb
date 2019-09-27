class TasksController < ApplicationController
  def index
    tasks = Task.task_list
    render json:tasks, only:[:activity, :status, :duration], include: [animal: {only: [:name, :species, :image]}]
  end
end
