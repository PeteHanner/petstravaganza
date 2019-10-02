class AddDifficultyToSessions < ActiveRecord::Migration[6.0]
  def change
    add_column :sessions, :difficulty, :string
  end
end
