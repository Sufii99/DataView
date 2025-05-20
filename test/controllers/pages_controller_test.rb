require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  # Comprueba que la página de guía responde correctamente
  test "should get guide" do
    get guide_path
    assert_response :success
  end

  # Comprueba que la página de preguntas frecuentes (FAQ) responde correctamente
  test "should get faq" do
    get faq_path
    assert_response :success
  end

  # Comprueba que la página de términos y condiciones responde correctamente
  test "should get terms" do
    get terms_path
    assert_response :success
  end

  # Comprueba que la página de política de privacidad responde correctamente
  test "should get privacy" do
    get privacy_path
    assert_response :success
  end

  # Verifica que el título de la página de guía es correcto
  test "guide has correct title" do
    get guide_path
    assert_select "title", /DataView \| Guía/
  end

  # Verifica que el título de la página de FAQ es correcto
  test "faq has correct title" do
    get faq_path
    assert_select "title", /DataView \| FAQ/
  end

  # Verifica que el título de la página de términos es correcto
  test "terms has correct title" do
    get terms_path
    assert_select "title", /DataView \| Términos y Condiciones/
  end

  # Verifica que el título de la página de privacidad es correcto
  test "privacy has correct title" do
    get privacy_path
    assert_select "title", /DataView \| Política de Privacidad/
  end

  # Verifica que la página de guía tiene el h1 correcto
  test "guide has correct h1" do
    get guide_path
    assert_select "h2, h1", text: /Bienvenido a DataView/
  end

  # Verifica que la página de FAQ tiene el h1 correcto
  test "faq has correct h1" do
    get faq_path
    assert_select "h1", text: /Preguntas Frecuentes/
  end

  # Verifica que la página de términos tiene el h1 correcto
  test "terms has correct h1" do
    get terms_path
    assert_select "h1", text: /Términos y Condiciones/
  end

  # Verifica que la página de privacidad tiene el h1 correcto
  test "privacy has correct h1" do
    get privacy_path
    assert_select "h1", text: /Política de Privacidad/
  end

  # Verifica que existe el enlace de volver en términos
  test "terms has back to main link" do
    get terms_path
    assert_select "a", text: /Volver a la página principal/
  end

  # Verifica que existe el enlace de volver en privacidad
  test "privacy has back to main link" do
    get privacy_path
    assert_select "a", text: /Volver a la página principal/
  end
end
