require "test_helper"

class ContactControllerTest < ActionDispatch::IntegrationTest
  test "should get contact_form" do
    get "/contact"
    assert_response :success
  end
end
