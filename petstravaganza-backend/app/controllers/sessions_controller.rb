class SessionsController < ApplicationController



  def index
    team = {
      peyton: 'pete',
      pete: 'peyton'
    }
    render json:team
  end
end
