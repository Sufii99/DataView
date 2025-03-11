# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # Sobrescribir para añadir el mensaje de bienvenida después del login
  def create
    super do |resource|
      flash[:notice] = "¡Bienvenido de nuevo, #{resource.username}!" if resource.present?
    end
  end

  # Sobrescribir para añadir el mensaje de despedida después del logout
  def destroy
    username = current_user&.username # Guardamos el nombre de usuario antes de cerrar sesión
    super
    flash[:notice] = "¡Hasta pronto, #{username}!" if username
  end

  # Mostrar mensaje cuando las credenciales son incorrectas
  def new
    super
    # flash[:alert] = "Usuario o contraseña incorrectos." if flash[:alert].present?
  end
end
