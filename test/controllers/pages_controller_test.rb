require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get guide" do
    get "/guide"
    assert_response :success
  end

  test "should get faq" do
    get "/faq"
    assert_response :success
  end

  test "should get terms" do
    get "/terms"
    assert_response :success
  end

  test "should get privacy" do
    get "/privacy"
    assert_response :success
  end
end
