class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }, confirmation: true, on: :create
  validates :password, length: { minimum: 8 }, confirmation: true, allow_blank: true, on: :update
  validates :password_confirmation, presence: true, on: :create

  def self.authenticate_by(credentials)
    find_by(email_address: credentials[:email_address])&.authenticate(credentials[:password])
  end
end
