class ContactController < ApplicationController
  def contact_form
  end

  def send_email
    ContactMailer.with(
      first_name: params[:'first-name'],
      last_name:  params[:'last-name'],
      email:      params[:email],
      phone:      params[:'phone-number'],
      message:    params[:message]
    ).contact_email.deliver_now

    redirect_to contact_path, notice: "Mensaje enviado con éxito."
  end
end
