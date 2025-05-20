require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  # Comprueba que la página de inicio responde correctamente
  test "should get index" do
    get home_index_url
    assert_response :success
  end

  # Comprueba que la ruta raíz (/) responde correctamente
  test "should get root" do
    get root_url
    assert_response :success
  end

  # Verifica que el título de la página es el esperado
  test "index has correct title" do
    get home_index_url
    assert_select "title", text: /DataView \| Inicio/
  end

  # Verifica que existen los enlaces principales en la portada
  test "index has start and learn more links" do
    get home_index_url
    assert_select "a", text: "Comenzar"
    assert_select "a", text: /Aprender más/
  end

  # Verifica que aparecen los encabezados/secciones clave de la home
  test "index shows hero and demo sections" do
    get home_index_url
    assert_select "h1", text: /Comienza a visualizar tus datos/
    assert_select "h2", text: /¿Qué es esta plataforma?/
    assert_select "h2", text: /Visualiza tus datos al instante/
    assert_select "h2", text: /Testimonios de nuestros usuarios/
  end

  # Comprueba que existe el contenedor para la demo de gráficas
  test "index includes chart demo root for react" do
    get home_index_url
    assert_select "#chart-demo-root"
  end
end
