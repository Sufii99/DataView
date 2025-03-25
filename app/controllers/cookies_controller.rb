class CookiesController < ApplicationController
  def accept
    cookies[:cookies_accepted] = { value: "true", expires: 1.year.from_now }
    cookies[:analytics_cookies] = { value: "true", expires: 1.year.from_now }
    cookies[:marketing_cookies] = { value: "true", expires: 1.year.from_now }
    redirect_to request.referer || root_path
  end

  def reject
    cookies[:cookies_accepted] = { value: "false", expires: 1.year.from_now }
    cookies[:analytics_cookies] = { value: "false", expires: 1.year.from_now }
    cookies[:marketing_cookies] = { value: "false", expires: 1.year.from_now }
    redirect_to request.referer || root_path
  end

  def preferences
  end

  def save_preferences
    cookies[:analytics_cookies] = { value: params[:preferences][:analytics] == "1" ? "true" : "false", expires: 1.year.from_now }
    cookies[:marketing_cookies] = { value: params[:preferences][:marketing] == "1" ? "true" : "false", expires: 1.year.from_now }
    cookies[:cookies_accepted] = { value: "true", expires: 1.year.from_now }

    flash[:success] = "¡Preferencias de cookies guardadas con éxito!"
    redirect_to request.referer || root_path
  end
end
