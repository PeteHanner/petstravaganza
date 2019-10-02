class Task < ApplicationRecord
  belongs_to :animal

  # @task_choices = ['food', 'water', 'potty', 'exercise']

  @task_choices = {
    'food' => 'assets/food-resized.png',
    'water' => 'assets/water-resized.png',
    'potty' => 'assets/tinkle-resized.png',
    'exercise' => 'assets/exercise-resized.png'
  }

  def self.task_list(animal_array)
    # initialize empty array
    task_array = []
    # populate array with 15 tasks
    15.times do
      task_array << self.make_task(animal_array)
    end

    # remove duplicates and top off until 15 unique tasks
    loop do
      check = self.check_for_duplicates(task_array)
      task_array = check[0]
      diff = check[1]
      break if diff <= 0
      diff.times {task_array << self.make_task(animal_array)}
    end

    # initialize, populate, and return array for actually created Tasks
    json_return = []
    task_array.each do |task|
      json_return << Task.create(
        activity: task.activity,
        animal: task.animal,
        image: @task_choices[task.activity]
      )
    end
    json_return
  end

  # Make a new task without saving to database
  def self.make_task(animal_array)
    animal_instance = animal_array.sample
    self.new(
      activity: @task_choices.keys.sample,
      animal: Animal.find(animal_instance['id'])
    )
  end

  def self.check_for_duplicates(task_array)
    # filter out tasks with same animal and activity
    no_dupes = task_array.uniq { |task| [task.animal, task.activity] }
    # store number of duplicates that were removed
    diff = task_array.length - no_dupes.length
    # pass array of unique tasks and difference for further work
    return [no_dupes, diff]
  end
end
