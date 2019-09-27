class Animal < ApplicationRecord
  has_many :tasks

  @animal_types = {
    'corgi' => 'petstravaganza-backend/app/resources/img/corgi.jpg',
    'parrot' => 'petstravaganza-backend/app/resources/img/parrot.jpg',
    'komodo dragon' => 'petstravaganza-backend/app/resources/img/komodo.jpg'
  }

  def self.generate
    # randomly generate an animal
    species = @animal_types.keys.sample
    # puts animals
    new_animal = self.create(
      name: Faker::Name.first_name,
      species: species,
      image: @animal_types[species]
    )
  end

  def self.generate_animal_array
    animal_array = []
    3.times do
      animal_array << self.generate
    end
    animal_array
  end

end
