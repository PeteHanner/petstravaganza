class RenameColumnTypeOnTasks < ActiveRecord::Migration[6.0]
  def change
    rename_column :tasks, :type, :activity
  end
end
