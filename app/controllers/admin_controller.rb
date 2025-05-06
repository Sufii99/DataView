class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin

  def panel
  end

  private

  def require_admin
    redirect_to root_path, alert: "No autorizado" unless current_user&.admin?
  end
end
