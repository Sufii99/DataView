require "test_helper"

class AdminControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  # Comprueba que un administrador puede acceder al panel de administración
  test "should get admin panel if user is admin" do
    admin = users(:one)
    sign_in admin

    get admin_panel_url
    assert_response :success
  end

  # Comprueba que un usuario no administrador es redirigido al intentar acceder al panel
  test "should redirect non-admin user from admin panel" do
    user = users(:two)
    sign_in user

    get admin_panel_url
    assert_redirected_to root_path
    follow_redirect!
    assert_match "No autorizado", response.body
  end

  # Comprueba que un administrador puede obtener la lista de usuarios vía API
  test "admin can fetch users list" do
    sign_in users(:one)
    get api_admin_users_url, as: :json
    assert_response :success
    assert_kind_of Array, response.parsed_body
  end

  # Comprueba que un administrador puede obtener estadísticas de registro de usuarios
  test "admin can fetch registration stats" do
    sign_in users(:one)
    get registration_stats_api_admin_users_url, as: :json
    assert_response :success
    assert_kind_of Array, response.parsed_body
  end

  # Comprueba que un administrador puede obtener la distribución de usuarios por país
  test "admin can fetch country distribution" do
    sign_in users(:one)
    get countries_distribution_api_admin_users_url, as: :json
    assert_response :success
    assert_kind_of Hash, response.parsed_body
  end

  # Comprueba que un administrador puede eliminar a un usuario
  test "admin can delete a user" do
    sign_in users(:one)
    user = users(:two)

    assert_difference("User.count", -1) do
      delete api_admin_user_url(user), as: :json
    end

    assert_response :success
    assert_includes response.parsed_body["message"], "eliminado"
  end

  # Comprueba que un usuario no administrador no puede acceder a la API de administración
  test "non-admin cannot access admin api" do
    sign_in users(:two)
    get api_admin_users_url, as: :json
    assert_response :unauthorized
  end
end
