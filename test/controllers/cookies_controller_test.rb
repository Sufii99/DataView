require "test_helper"

class CookiesControllerTest < ActionDispatch::IntegrationTest
  # Comprueba que al aceptar cookies se establece la cookie correspondiente
  test "should set cookies_accepted cookie on accept" do
    post cookies_accept_url
    assert_response :success
    assert_equal "true", cookies[:cookies_accepted]
  end
end
