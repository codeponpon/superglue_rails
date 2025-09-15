import React, { useState, useEffect } from "react";
import { useContent, useStreamSource } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import { ArrowLeft, Edit, Calendar, Clock, Trash2 } from "lucide-react";
import { ChannelNameWithParams } from "@rails/actioncable";

interface Task {
  id: number;
  title: string;
  allotted_time: number;
  position: number;
  created_at: string;
  updated_at: string;
}

interface ProjectShowContent {
  project: {
    id: number;
    name: string;
    description: string;
    slug: string;
    created_at: string;
    updated_at: string;
    timestamp?: number;
    edit_path: string;
    delete_path: string;
    back_path: string;
    tasks: Task[];
  };
  streamFromProject: string | ChannelNameWithParams;
}

export default function ProjectsShow() {
  const { project, streamFromProject } = useContent<ProjectShowContent>();
  const { tasks } = project;
  const [isDeleting, setIsDeleting] = useState(false);
  const { connected } = useStreamSource(streamFromProject);

  // Set up streaming subscription
  useEffect(() => {
    if (streamFromProject) {
      console.log("Streaming setup:", streamFromProject);
      // The streaming is handled automatically by Superglue
      // This effect ensures the component is ready for updates
    }
  }, [streamFromProject, connected]);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone and will delete all associated tasks.`
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await fetch(project.delete_path, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "X-CSRF-Token":
              document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "",
          },
        });

        if (response.ok) {
          await response.json();
          // Redirect to projects list
          window.location.href = project.back_path;
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            errorData.message || "Failed to delete project. Please try again."
          );
          setIsDeleting(false);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("An error occurred while deleting the project.");
        setIsDeleting(false);
      }
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalAllottedTime = tasks.reduce(
    (sum, task) => sum + task.allotted_time,
    0
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto mt-16 mb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <a
              href={project.back_path}
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Projects</span>
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={project.edit_path}
              className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 flex items-center space-x-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Project</span>
            </a>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "Deleting..." : "Delete Project"}</span>
            </button>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.name} {connected ? "🟢" : "🔴"}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{project.description}</p>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()} (Server:{" "}
            {project.timestamp
              ? new Date(project.timestamp * 1000).toLocaleTimeString()
              : "N/A"}
            )
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Total Time: {formatTime(totalAllottedTime)}</span>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tasks</h2>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks yet</p>
              <p className="text-gray-400">
                Add some tasks to get started with this project.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(task.allotted_time)}</span>
                        </div>
                        <span>Created {formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
