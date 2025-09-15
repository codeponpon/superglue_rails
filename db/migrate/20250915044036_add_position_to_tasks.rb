class AddPositionToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :position, :integer, default: 0
    add_index :tasks, [ :project_id, :position ]
  end
end
