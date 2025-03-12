class CookiesController < ApplicationController
  def accept
    cookies[:cookies_accepted] = { value: "true", expires: 1.year.from_now }
    head :ok
  end

  def reject
    cookies[:cookies_accepted] = { value: "false", expires: 1.year.from_now }
    head :ok
  end
end
