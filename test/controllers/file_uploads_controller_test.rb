require "test_helper"

class FileUploadsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = User.create!(
      email: "testuser@dataview.com",
      password: "123456",
      first_name: "Test",
      last_name: "User",
      confirmed_at: Time.now
    )
  end

  # Comprueba que GET /file_uploads responde correctamente autenticado
  test "should get index" do
    sign_in @user
    get file_uploads_url, as: :json
    assert_response :success
  end

  # Comprueba que POST /file_uploads con datos válidos crea un archivo
  test "should create file_upload with file and name" do
    sign_in @user
    file = fixture_file_upload("simple.csv", "text/csv")
    assert_difference("FileUpload.count") do
      post file_uploads_url, params: { name: "Archivo test", file: file }, as: :multipart
    end
    assert_response :created
    assert_includes response.parsed_body["name"], "Archivo test"
  end

  # Comprueba que no se puede crear archivo sin nombre
  test "should not create file_upload without name" do
    sign_in @user
    file = fixture_file_upload("simple.csv", "text/csv")

    assert_no_difference("FileUpload.count") do
      post file_uploads_url, params: { name: "", file: file }, as: :multipart
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"], "Nombre no puede estar en blanco"
  end

  # Comprueba que no se puede crear un archivo sin adjuntar un fichero
  test "should not create file_upload without file" do
    sign_in @user
    assert_no_difference("FileUpload.count") do
      post file_uploads_url, params: { name: "Sin archivo" }, as: :multipart
    end
    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"], "Archivo debe estar adjunto"
  end

  # Comprueba que puedes eliminar un archivo propio
  test "should destroy file_upload" do
    sign_in @user
    file = fixture_file_upload("simple.csv", "text/csv")
    post file_uploads_url, params: { name: "Para borrar", file: file }, as: :multipart
    assert_response :created
    file_id = response.parsed_body["id"]
    assert_not_nil file_id, "La respuesta no devolvió un ID de archivo válido"

    assert_difference("FileUpload.count", -1) do
      delete file_upload_url(file_id), as: :json
    end

    assert_response :no_content
  end
end
