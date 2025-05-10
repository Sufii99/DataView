module Api
  module Admin
    class UsersController < ApplicationController
      before_action :authenticate_user!
      before_action :require_admin

      def index
        users = User.select(:id, :email, :first_name, :last_name, :admin)
        render json: users
      end

      def destroy
        user = User.find(params[:id])
        if user == current_user
          render json: { error: "No puedes eliminarte a ti mismo" }, status: :forbidden
        else
          user.destroy
          render json: { message: "Usuario eliminado" }, status: :ok
        end
      end

      def countries_distribution
        data = User.where.not(country: [ nil, "" ]).group(:country).count
        render json: data
      end

      private

      def require_admin
        unless current_user&.admin?
          render json: { error: "No autorizado" }, status: :unauthorized
        end
      end
    end
  end
end
