require "test_helper"

class FileUploadTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  # Comprueba que un archivo válido con todos los campos requeridos es válido
  test "valid file upload" do
    file_upload = FileUpload.new(
      name: "Prueba",
      user: users(:one)
    )
    file_upload.data_file.attach(io: StringIO.new("contenido"), filename: "test.csv", content_type: "text/csv")

    assert file_upload.valid?
  end

  # Comprueba que no es válido sin nombre
  test "invalid without name" do
    file_upload = FileUpload.new(
      name: nil,
      user: users(:one)
    )
    file_upload.data_file.attach(io: StringIO.new("contenido"), filename: "test.csv", content_type: "text/csv")

    assert_not file_upload.valid?
    assert_includes file_upload.errors.details[:name], { error: :blank }
  end

  # Comprueba que no es válido sin archivo adjunto
  test "invalid without data_file attached" do
    file_upload = FileUpload.new(
      name: "Archivo sin contenido",
      user: users(:one)
    )

    assert_not file_upload.valid?
    assert_includes file_upload.errors.details[:data_file], { error: :blank }
  end

  # Comprueba que pertenece a un usuario
  test "belongs to a user" do
    file_upload = file_uploads(:one) # Asume que tienes un fixture con user asociado
    assert_not_nil file_upload.user
    assert_instance_of User, file_upload.user
  end
end
