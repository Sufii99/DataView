class ContactFormController < ApplicationController
  def create
    if params[:contact_form].values.any?(&:blank?)
      flash[:error] = "Todos los campos son obligatorios."
      redirect_to contact_path
    else
      @name = params[:contact_form][:name]
      @last_name = params[:contact_form][:last_name]
      @email = params[:contact_form][:email]
      @message = params[:contact_form][:message]

      ContactMailer.simple_message(@name, @last_name, @email, @message).deliver_now
      flash[:success] = "Tu mensaje ha sido enviado con éxito."
      redirect_to contact_path
    end
  end
end
