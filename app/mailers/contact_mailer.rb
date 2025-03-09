class ContactMailer < ApplicationMailer
  default to: "dataviewtest@gmail.com",
    from: "dataviewtest@gmail.com"

  def simple_message(first_name, last_name, email, message)
    @first_name = first_name
    @last_name = last_name
    @email = email
    @message = message

    # Correo HTML
    mail(
      "reply-to": email_address_with_name(email, "#{first_name} #{last_name}"),
      subject: "Nuevo mensaje del formulario de contacto"
    ) do |format|
      format.html { render "contact_mailer/simple_message" } # Renderiza la vista HTML
    end
  end
end
