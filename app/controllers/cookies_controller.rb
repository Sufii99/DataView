class CookiesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :accept ]

  def accept
    cookies[:cookies_accepted] = { value: "true", expires: 1.year.from_now }
    head :ok
  end
end
