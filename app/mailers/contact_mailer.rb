class ContactMailer < ApplicationMailer
  default to: "dataviewtest@gmail.com", from: "no-reply@dataview.app"

  def contact_email
    @first_name = params[:first_name]
    @last_name  = params[:last_name]
    @user_email = params[:email]
    @phone      = params[:phone]
    @message    = params[:message]

    mail(subject: "Nuevo mensaje de contacto desde DataView")
  end
end
