class Task < ApplicationRecord
  belongs_to :animal

  @task_choices = ['food', 'water', 'potty', 'exercise']

  # animals = self.get_animals

  def self.task_list(animal_array)
    task_array = []
    # X times create a task
    15.times do
      task_array << self.new(
        activity: @task_choices.sample,
        duration: 5000,
        status: 'queued',
        animal: animal_array.sample
      )
    end
    task_array
  end


end
