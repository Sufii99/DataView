require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  # Comprueba que un usuario autenticado puede acceder al panel (/dashboard)
  test "should get dashboard if user is signed in" do
    user = users(:one)
    sign_in user

    get dashboard_path
    assert_response :success
    assert_select "div#dashboard-root" # Comprueba que se renderiza el contenedor React
  end

  # Comprueba que un usuario no autenticado es redirigido al intentar acceder al panel
  test "should redirect unauthenticated user from dashboard" do
    get dashboard_path
    assert_response :redirect
    assert_redirected_to new_user_session_path
  end

  # Comprueba que la vista contiene el título adecuado en el layout
  test "dashboard has correct title" do
    user = users(:one)
    sign_in user

    get dashboard_path
    assert_select "title", text: /DataView \| Panel/
  end
end
