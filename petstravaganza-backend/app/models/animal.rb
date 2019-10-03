class Animal < ApplicationRecord
  has_many :tasks

  @animal_types = {
    'corgi' => 'assets/corgi.jpg',
    'parrot' => 'assets/parrot.jpg',
    'komodo dragon' => 'assets/komodo.jpg',
    'dilophosaurus' => 'assets/dilo2.jpg',
    'beluga whale' => 'assets/beluga.jpg',
    'chow chow' => 'assets/chowchow.jpg',
    'doodle' => 'assets/doodle.jpg',
    'jellyfish' => 'assets/jellyfish.jpg',
    'persian cat' => 'assets/persian.jpg',
    'chameleon' => 'assets/chameleon.jpg',
    'cheetah' => 'assets/cheetah.jpg',
    'horse' => 'assets/horse.jpg',
    'dachshund' => 'assets/dachshund.jpg',
    'capybara' => 'assets/capybara.jpg',
    'golden retriever' => 'assets/golden.jpg',
    'pitbull' => 'assets/pitbull.jpg',
    'boa constrictor' => 'assets/boa.jpg',
    'husky' => 'assets/husky.jpg',
    'pig' => 'assets/pig.jpg',
    'parakeet' => 'assets/parakeet.jpg',
    'eldritch horror' => 'assets/cthulhu.jpg',
    'german shepherd' => 'assets/gsd.jpg',
    'greyhound' => 'assets/greyhound.jpg',
    'samoyed' => 'assets/samoyed.jpg',
    'iguana' => 'assets/iguana.jpg',
    'gecko' => 'assets/gecko.jpg',
    'tabby cat' => 'assets/tabby.jpg',
    'siamese cat' => 'assets/siamese.jpg',
    'black lab' => 'assets/blacklab.jpg',
    'shiba' => 'assets/shiba.jpg',
    'schnauzer' => 'assets/schnauzer.jpg',
    'bernese' => 'assets/bernese.jpg',
    'aussie' => 'assets/aussie.png',
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
    6.times do
      animal_array << self.generate
    end
    animal_array
  end

end
