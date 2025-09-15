class ProjectsController < ApplicationController
  allow_unauthenticated_access only: [ :new, :create, :add_task, :show, :edit, :update, :sort_tasks ]
  before_action :set_project, only: [ :show, :edit, :update, :destroy, :sort_tasks ]

  def index
    @pagy, @projects = pagy(Project.recent, limit: 6)
  end

  def show
  end

  def edit
  end

  def new
    @project = Project.new
    @tasks = @project.tasks.build
  end

  def create
    @project = Project.new(project_params)

    if @project.save
      respond_to do |format|
        format.html { redirect_to projects_path, notice: "Project created successfully" }
        format.json do
          # For data-sg-visit, redirect to projects index
          response.set_header("content-location", project_path(@project))
          flash.now[:notice] = "Project created successfully"
          # Set up variables needed for index template
          @pagy, @projects = pagy(Project.recent, limit: 6)
          @projects = @projects.compact
          @projects = [] if @projects.nil?
          render :show
        end
      end
    else
      respond_to do |format|
        format.html do
          response.set_header("content-location", new_project_path)
          flash.now[:alert] = "There was an error creating your project"
          render :new
        end
        format.json do
          # For data-sg-remote, stay on new project page with errors
          response.set_header("content-location", new_project_path)
          flash.now[:alert] = "There was an error creating your project"
          # Ensure @project has tasks for the form
          @project.tasks.build if @project.tasks.empty?
          render :new
        end
      end
    end
  end

  def update
    if @project.update(project_params)
      respond_to do |format|
        format.html { redirect_to @project, notice: "Project updated successfully" }
        format.json do
          # For data-sg-remote, stay on edit page with success message
          response.set_header("content-location", edit_project_path(@project))
          flash.now[:notice] = "Project updated successfully"
          render :edit
        end
      end
    else
      respond_to do |format|
        format.html do
          response.set_header("content-location", edit_project_path(@project))
          flash.now[:alert] = "There was an error updating your project"
          render :edit
        end
        format.json do
          # For data-sg-remote, render the edit page with errors
          response.set_header("content-location", edit_project_path(@project))
          flash.now[:alert] = "There was an error updating your project"
          render :edit
        end
      end
    end
  end

  def destroy
    @project.destroy

    respond_to do |format|
      format.html { redirect_to projects_path, notice: "Project deleted successfully" }
      format.json { render json: { status: "success", message: "Project deleted successfully" } }
    end
  end

  def add_task
    begin
      @project = Project.new
      @project.tasks.build

      timestamp = Time.current.to_i
      render json: {
        status: "success",
        task: {
          title: {
            name: "project[tasks_attributes][#{timestamp}][title]",
            value: "",
            type: "text",
            id: "project_tasks_attributes_#{timestamp}_title"
          },
          allottedTime: {
            name: "project[tasks_attributes][#{timestamp}][allotted_time]",
            value: "",
            type: "number",
            id: "project_tasks_attributes_#{timestamp}_allotted_time"
          }
        }
      }
    rescue => e
      render json: {
        status: "error",
        message: "Failed to add task",
        error: e.message
      }, status: :internal_server_error
    end
  end

  def sort_tasks
    task_ids = params[:task_ids]

    if task_ids.present?
      task_ids.each_with_index do |task_id, index|
        task = @project.tasks.find(task_id)
        task.update_column(:position, index)
      end

      render json: { status: "success", message: "Tasks reordered successfully" }
    else
      render json: { status: "error", message: "No task IDs provided" }, status: :bad_request
    end
  end

  private

  def set_project
    @project = Project.friendly.find(params[:id])
  end

  def project_params
    params.expect(project: [ :name, :description, tasks_attributes: [ [ :id, :title, :allotted_time, :position, :_destroy ] ] ])
  end
end
