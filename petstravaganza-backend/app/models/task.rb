class Task < ApplicationRecord
  belongs_to :animal

  @task_choices = ['food', 'water', 'potty', 'exercise']

  # animals = self.get_animals

  def self.task_list(animal_array)
    task_array = []
    # X times create a task
    15.times do
      animal_instance = animal_array.sample
      task_array << self.create(
        activity: @task_choices.sample,
        duration: 10000,
        status: 'queued',
        animal: Animal.find(animal_instance['id'])
      )
    end
    task_array
  end
end
