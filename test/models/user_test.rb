require "test_helper"

class UserTest < ActiveSupport::TestCase
  # Comprueba que un usuario válido con todos los atributos mínimos es válido
  test "valid user" do
    user = User.new(
      email: "test@example.com",
      password: "password123",
      first_name: "Test",
      last_name: "User"
    )
    assert user.valid?
  end

  # Comprueba que un usuario sin nombre no es válido
  test "invalid without first_name" do
    user = User.new(
      email: "test@example.com",
      password: "password123",
      first_name: nil,
      last_name: "User"
    )
    assert_not user.valid?
    assert_includes user.errors[:first_name], "no puede estar en blanco"
  end

  # Comprueba que un usuario sin apellido no es válido
  test "invalid without last_name" do
    user = User.new(
      email: "test@example.com",
      password: "password123",
      first_name: "Test",
      last_name: nil
    )
    assert_not user.valid?
    assert_includes user.errors[:last_name], "no puede estar en blanco"
  end

  # Comprueba que el método admin? funciona correctamente
  test "admin? returns true for admin user" do
    admin_user = users(:one)
    assert admin_user.admin?
  end

  # Comprueba que los file_uploads se eliminan al borrar el usuario
  test "file_uploads are destroyed when user is destroyed" do
    user = users(:two) # Con archivos asociados
    assert_difference("FileUpload.count", -user.file_uploads.count) do
      user.destroy
    end
  end
end
