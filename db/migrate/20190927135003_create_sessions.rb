class CreateSessions < ActiveRecord::Migration[6.0]
  def change
    create_table :sessions do |t|
      t.string :username
      t.integer :score

      t.timestamps
    end
  end
end
