class Task < ApplicationRecord
  belongs_to :animal

  # @task_choices = ['food', 'water', 'potty', 'exercise']

  @task_choices = {
    'food' => 'assets/food-resized.png',
    'water' => 'assets/water-resized.png',
    'potty' => 'assets/tinkle-resized.png',
    'exercise' => 'assets/exercise-resized.png'
  }

  # animals = self.get_animals

  # ORIGINAL
#   def self.task_list(animal_array)
#     task_array = []
#     # X times create a task
#     15.times do
#       animal_instance = animal_array.sample
#       task_array << self.create(
#         activity: @task_choices.sample,
#         duration: 10000,
#         status: 'queued',
#         animal: Animal.find(animal_instance['id'])
#       )
#     end
#     task_array
#   end
# end

  # NEW
  def self.task_list(animal_array)
    task_array = []
    # X times create a task
    15.times do
      animal_instance = animal_array.sample
      activity = @task_choices.keys.sample
      task_array << self.create(
        activity: activity,
        duration: 10000,
        status: 'queued',
        animal: Animal.find(animal_instance['id']),
        image: @task_choices[activity]
      )
    end
    task_array
  end
end
