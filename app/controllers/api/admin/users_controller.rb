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

      def registration_stats
        date_trunc = Arel.sql("DATE_TRUNC('month', created_at)")

        stats = User
          .group(date_trunc)
          .order(date_trunc)
          .count
          .map { |date, count| { date: date.strftime("%Y-%m"), count: count } }

        render json: stats
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
