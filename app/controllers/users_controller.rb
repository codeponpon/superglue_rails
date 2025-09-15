class UsersController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  before_action :set_user, only: %i[ show edit update destroy ]

  def index
    @users = User.all.order(:email_address)
  end

  def show
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      start_new_session_for @user
      redirect_to dashboard_index_path, notice: "Account created successfully! Welcome!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    # Handle password updates - only update password if provided
    update_params = user_params
    if update_params[:password].blank?
      update_params = update_params.except(:password, :password_confirmation)
    end

    if @user.update(update_params)
      redirect_to users_path, notice: "User updated successfully"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    redirect_to users_path, notice: "User deleted successfully"
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:email_address, :password, :password_confirmation)
  end
end
