class RenameTaskAllotedTimeToAllottedTime < ActiveRecord::Migration[8.0]
  def change
    rename_column :tasks, :alloted_time, :allotted_time
  end
end
