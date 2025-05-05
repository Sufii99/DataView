class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  has_one_attached :avatar

  validates :first_name, presence: true
  validates :last_name, presence: true

  has_many :file_uploads, dependent: :destroy

  def admin?
    self.admin
  end
end
