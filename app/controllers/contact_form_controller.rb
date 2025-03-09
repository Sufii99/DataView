class ContactFormController < ApplicationController
  def create
    @name = params[:contact_form][:name]
    @last_name = params[:contact_form][:last_name]
    @email = params[:contact_form][:email]
    @message = params[:contact_form][:message]

    ContactMailer.simple_message(@name, @last_name, @email, @message).deliver_now
    flash[:success] = "Your message has been sent successfully."
    redirect_to contact_path # Redirige después de procesar el formulario
  end
end
