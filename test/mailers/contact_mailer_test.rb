require "test_helper"

class ContactMailerTest < ActionMailer::TestCase
  # Comprueba que el correo se genera correctamente con los parámetros esperados
  test "sends contact email with correct details" do
    mail = ContactMailer.with(
      first_name: "Data",
      last_name: "View",
      email: "data@view.com",
      phone: "123456789",
      message: "Hola, quería hacer una consulta sobre la plataforma."
    ).contact_email

    # Enviado a la dirección correcta
    assert_equal [ "dataviewtest@gmail.com" ], mail.to

    # Remitente predeterminado
    assert_equal [ "no-reply@dataview.app" ], mail.from

    # Asunto correcto
    assert_equal "Nuevo mensaje de contacto desde DataView", mail.subject

    # El cuerpo debe incluir los datos del mensaje
    assert_match "Data View", mail.body.encoded
    assert_match "data@view.com", mail.body.encoded
    assert_match "123456789", mail.body.encoded
    assert_match "Hola, quería hacer una consulta", mail.body.encoded
  end
end
