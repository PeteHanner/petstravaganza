class Animal < ApplicationRecord
  has_many :tasks

  @animal_types = {
    'corgi' => 'assets/corgi.jpg',
    'parrot' => 'assets/parrot.jpg',
    'komodo dragon' => 'assets/komodo.jpg',
    'dilophosaurus' => 'assets/dilo.png'
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
    4.times do
      animal_array << self.generate
    end
    animal_array
  end

end
