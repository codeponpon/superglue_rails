class Project < ApplicationRecord
  include Superglue::Broadcastable
  extend FriendlyId
  friendly_id :name, use: :slugged

  validates :name, presence: true

  has_many :tasks, -> { ordered }, dependent: :destroy

  scope :recent, -> { order(created_at: :desc) }

  accepts_nested_attributes_for :tasks, allow_destroy: true

  def self.search(search)
    return [] if search.blank?

    if search
      where("UPPER(name) LIKE UPPER(?)", "%#{search}%")
    else
      all
    end
  end
end
