import React from "react";
import { useContent, useStreamSource } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import Link from "../../frontend/components/ui/Link";
import Pagination from "../../frontend/components/navigation/Pagination";
import { Trash2, Edit } from "lucide-react";
import { ChannelNameWithParams } from "@rails/actioncable";

interface Project {
  id: number;
  name: string;
  description?: string;
  url: string;
  edit_path: string;
  delete_path: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface ProjectsPageContent {
  projects: Project[];
  newProjectPath: string;
  pagination: PaginationData;
  streamFromProjects: string | ChannelNameWithParams;
}

export default function ProjectsIndex() {
  const { projects, newProjectPath, pagination, streamFromProjects } =
    useContent<ProjectsPageContent>();
  const { connected } = useStreamSource(streamFromProjects);

  const handleDelete = async (projectId: number, projectName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${projectName}"? This action cannot be undone and will delete all associated tasks.`
      )
    ) {
      try {
        const response = await fetch(`/projects/${projectId}`, {
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
          // Reload the page to reflect the changes
          window.location.reload();
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            errorData.message || "Failed to delete project. Please try again."
          );
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("An error occurred while deleting the project.");
      }
    }
  };

  return (
    <AppLayout>
      <div className="px-8 mt-6 mb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">
            Projects {connected ? "🟢" : "🔴"}
          </h1>
          <a href={newProjectPath} data-sg-visit>
            New Project
          </a>
        </div>
        <ul className="space-y-4 mt-2">
          {projects.map((project: Project, index: number) => (
            <li
              key={index.toString()}
              className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={project.url}
                    visit
                    variant="inherit"
                    size="lg"
                    weight="semibold"
                    className="text-lg font-semibold hover:text-indigo-600"
                  >
                    {project?.name}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1">
                    {project?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <a
                    href={project.edit_path}
                    data-sg-visit
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Pagination pagination={pagination} className="mt-6" />
      </div>
    </AppLayout>
  );
}
