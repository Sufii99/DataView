class FileUpload < ApplicationRecord
  belongs_to :user
  has_one_attached :data_file # Usamos Active Storage para el archivo real

  validates :name, presence: true
  validates :data_file, attached: true
end
