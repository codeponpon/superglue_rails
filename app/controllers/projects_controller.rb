class ProjectsController < ApplicationController
  allow_unauthenticated_access only: [ :new, :create, :add_task, :show, :edit, :update ]
  before_action :set_project, only: [ :show, :edit, :update, :destroy ]

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
      redirect_to projects_path, notice: "Project created successfully"
    else
      response.set_header("content-location", new_project_path)
      flash.now[:alert] = "There was an error creating your project"
      render :new
    end
  end

  def update
    if @project.update(project_params)
      redirect_to @project, notice: "Project updated successfully"
    else
      response.set_header("content-location", edit_project_path(@project))
      flash.now[:alert] = "There was an error updating your project"
      render :edit
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
    @project = Project.new
    @project.tasks.build
    render json: {
      task: {
        title: {
          name: "project[tasks_attributes][#{Time.current.to_i}][title]",
          value: "",
          type: "text",
          id: "project_tasks_attributes_#{Time.current.to_i}_title"
        },
        allottedTime: {
          name: "project[tasks_attributes][#{Time.current.to_i}][allotted_time]",
          value: "",
          type: "number",
          id: "project_tasks_attributes_#{Time.current.to_i}_allotted_time"
        }
      }
    }
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.expect(project: [ :name, :description, tasks_attributes: [ [ :id, :title, :allotted_time, :_destroy ] ] ])
  end
end
