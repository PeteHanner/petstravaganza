class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :type
      t.integer :duration
      t.string :status
      t.string :image
      t.references :animal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
