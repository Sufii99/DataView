class FileUpload < ApplicationRecord
  belongs_to :user
  has_one_attached :data_file # Active Storage para guardar el archivo real

  validates :name, presence: true
  validate :data_file_attached

  private

  def data_file_attached
    unless data_file.attached?
      errors.add(:data_file, :blank)
    end
  end
end
