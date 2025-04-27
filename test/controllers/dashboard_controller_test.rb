require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "should get show" do
    user = users(:one)
    sign_in user

    get "/dashboard"
    assert_response :success
  end
end
