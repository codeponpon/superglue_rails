class Task < ApplicationRecord
  belongs_to :project

  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :created_at) }

  after_initialize :set_default_position, if: :new_record?

  private

  def set_default_position
    self.position ||= (project&.tasks&.maximum(:position) || -1) + 1
  end
end
