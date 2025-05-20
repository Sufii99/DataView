require "test_helper"

class ContactControllerTest < ActionDispatch::IntegrationTest
  # Comprueba que la página de contacto responde correctamente
  test "should get contact_form" do
    get contact_path
    assert_response :success
  end

  # Verifica que el título de la página de contacto es correcto
  test "contact has correct title" do
    get contact_path
    assert_select "title", /DataView \| Contacto/
  end

  # Verifica que el formulario de contacto tiene los campos principales
  test "contact form has main fields" do
    get contact_path
    assert_select "input[name=?]", "first-name"
    assert_select "input[name=?]", "last-name"
    assert_select "input[name=?]", "email"
    assert_select "input[name=?]", "phone-number"
    assert_select "textarea[name=?]", "message"
  end

  # Verifica que el formulario tiene el botón de enviar
  test "contact form has submit button" do
    get contact_path
    assert_select "button[type=?]", "submit"
    assert_select "button", text: /Enviar/
  end

  # Comprueba que el formulario se envía correctamente con todos los campos obligatorios
  test "sends contact form with required fields" do
    assert_emails 1 do
      post "/contacto", params: {
        'first-name': "Juan",
        'last-name': "",
        email: "juan@example.com",
        'phone-number': "",
        message: "Este es un mensaje de prueba."
      }
    end
    assert_redirected_to contact_path
    follow_redirect!
    assert_match(/Mensaje enviado con éxito/, @response.body)
  end

  # Comprueba que NO se envía si falta el nombre
  test "does not send if name is missing" do
    assert_emails 0 do
      post "/contacto", params: {
        'first-name': "",
        'last-name': "",
        email: "juan@example.com",
        'phone-number': "",
        message: "Mensaje"
      }
    end
    assert_redirected_to contact_path
    follow_redirect!
    assert_match(/rellena los campos obligatorios/i, @response.body)
  end

  # Comprueba que NO se envía si falta el email
  test "does not send if email is missing" do
    assert_emails 0 do
      post "/contacto", params: {
        'first-name': "Juan",
        'last-name': "",
        email: "",
        'phone-number': "",
        message: "Mensaje"
      }
    end
    assert_redirected_to contact_path
    follow_redirect!
    assert_match(/rellena los campos obligatorios/i, @response.body)
  end

  # Comprueba que NO se envía si falta el mensaje
  test "does not send if message is missing" do
    assert_emails 0 do
      post "/contacto", params: {
        'first-name': "Juan",
        'last-name': "",
        email: "juan@example.com",
        'phone-number': "",
        message: ""
      }
    end
    assert_redirected_to contact_path
    follow_redirect!
    assert_match(/rellena los campos obligatorios/i, @response.body)
  end
end
