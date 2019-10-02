class RemoveStatusAndDurationFromTasks < ActiveRecord::Migration[6.0]
  def change

    remove_column :tasks, :status, :string

    remove_column :tasks, :duration, :integer
  end
end
