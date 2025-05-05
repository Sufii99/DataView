class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin

  def index
    @users = User.all
    if params[:q].present?
      @users = User.where("email ILIKE ?", "%#{params[:q]}%")
    else
      @users = User.all
    end
  end

  def destroy
    @user = User.find(params[:id])
    if @user == current_user
      redirect_to admin_users_path, alert: "No puedes eliminar tu propia cuenta."
    else
      @user.destroy
      redirect_to admin_users_path, notice: "Usuario eliminado correctamente."
    end
  end

  private

  def require_admin
    redirect_to root_path, alert: "No autorizado" unless current_user&.admin?
  end
end
