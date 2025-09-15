import React, { useState, useEffect, useRef } from "react";
import { useContent } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import {
  Form,
  FieldBase,
  TextArea,
  SubmitButton,
} from "../../frontend/components/Inputs";
import { Plus, Trash2, ArrowLeft, RotateCcw, GripVertical } from "lucide-react";

interface FormData {
  action: string;
  method: string;
  authenticity_token: string;
}

interface InputData {
  name: string;
  value: string;
  type: string;
  id: string;
}

interface TaskInput {
  id: number;
  title: InputData;
  allottedTime: InputData;
  taskId?: number; // Add taskId for existing tasks
  _destroy?: boolean; // Add _destroy for marking tasks for deletion
  formIndex: number; // Add form index for proper form field naming
  position: number; // Add position for task ordering
  uniqueId: string; // Add unique identifier for drag and drop
}

interface FormInputs {
  name: InputData;
  description: InputData;
  tasksAttributes: TaskInput[];
}

interface FormExtras {
  [key: string]: any;
}

interface ValidationErrors {
  [key: string]: string[];
}

interface Task {
  id: number;
  title: string;
  allotted_time: number;
  position: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

interface ProjectEditContent {
  edit_project_form: {
    form: FormData;
    extras: FormExtras;
    inputs: FormInputs;
    errors: ValidationErrors;
  };
  project: Project;
  tasks: Task[];
  sortTasksPath: string;
}

export default function ProjectsEdit() {
  const {
    edit_project_form,
    project,
    tasks: existingTasks,
    sortTasksPath,
  } = useContent<ProjectEditContent>();
  const { form, extras, inputs, errors } = edit_project_form;

  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [taskCounter, setTaskCounter] = useState(0);
  const [sortBy] = useState<
    "position" | "title" | "allotted_time" | "created_at"
  >("position");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"above" | "below" | null>(
    null
  );
  const tasksInitialized = useRef(false);

  useEffect(() => {
    // Only initialize tasks if we haven't initialized them yet
    if (!tasksInitialized.current && existingTasks.length > 0) {
      // Map existing tasks with their IDs to the form structure
      // Since tasks are now ordered by position from the server, we need to map them correctly
      const mappedTasks = existingTasks.map((existingTask, index) => {
        // Find the corresponding task input by matching the task ID
        const taskInput = inputs.tasksAttributes?.find((input) => {
          // Match by task ID if available
          return input.id === existingTask.id;
        });

        if (taskInput) {
          return {
            ...taskInput,
            taskId: existingTask.id,
            formIndex: index, // Use the position-based index
            position: existingTask.position,
            uniqueId: `task-${existingTask.id}`,
          };
        }

        // Fallback: create a basic task input structure
        return {
          id: existingTask.id,
          taskId: existingTask.id,
          formIndex: index,
          position: existingTask.position,
          uniqueId: `task-${existingTask.id}`,
          title: {
            name: `project[tasks_attributes][${index}][title]`,
            value: existingTask.title,
            type: "text",
            id: `project_tasks_attributes_${index}_title`,
          },
          allottedTime: {
            name: `project[tasks_attributes][${index}][allotted_time]`,
            value: existingTask.allotted_time.toString(),
            type: "number",
            id: `project_tasks_attributes_${index}_allotted_time`,
          },
        };
      });

      setTasks(mappedTasks);
      // Set task counter to continue from existing tasks count
      setTaskCounter(mappedTasks.length);
      tasksInitialized.current = true;
    }
  }, [inputs.tasksAttributes, existingTasks]);

  // Cleanup drag image on unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining drag images
      const dragImages = document.querySelectorAll("[data-drag-image]");
      dragImages.forEach((img) => {
        if (document.body.contains(img)) {
          document.body.removeChild(img);
        }
      });
    };
  }, []);

  const updateTaskField = (
    taskId: string,
    field: "title" | "allottedTime",
    value: string
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.uniqueId === taskId
          ? { ...task, [field]: { ...task[field], value } }
          : task
      )
    );
  };

  const addTask = async () => {
    try {
      const response = await fetch("/projects/add_task", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newTask = {
          id: taskCounter, // Add the required id property
          formIndex: taskCounter, // Use taskCounter as form index
          position: taskCounter, // Set position to match form index
          uniqueId: `new-task-${taskCounter}`,
          title: {
            ...data.task.title,
            name: `project[tasks_attributes][${taskCounter}][title]`,
            id: `project_tasks_attributes_${taskCounter}_title`,
          },
          allottedTime: {
            ...data.task.allottedTime,
            name: `project[tasks_attributes][${taskCounter}][allotted_time]`,
            id: `project_tasks_attributes_${taskCounter}_allotted_time`,
          },
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTaskCounter((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => {
      const taskToRemove = prevTasks.find((task) => task.uniqueId === taskId);
      if (!taskToRemove) return prevTasks;

      // If task is already marked for destruction, restore it
      if (taskToRemove._destroy) {
        return prevTasks.map((task) =>
          task.uniqueId === taskId ? { ...task, _destroy: false } : task
        );
      }

      // If it's an existing task (has taskId), mark it for destruction
      if (taskToRemove.taskId) {
        return prevTasks.map((task) =>
          task.uniqueId === taskId ? { ...task, _destroy: true } : task
        );
      } else {
        // If it's a new task (no taskId), remove it and reindex remaining tasks
        const filteredTasks = prevTasks.filter(
          (task) => task.uniqueId !== taskId
        );
        return filteredTasks.map((task, i) => ({
          ...task,
          formIndex: i,
          position: i, // Update position to match new order
          title: {
            ...task.title,
            name: `project[tasks_attributes][${i}][title]`,
            id: `project_tasks_attributes_${i}_title`,
          },
          allottedTime: {
            ...task.allottedTime,
            name: `project[tasks_attributes][${i}][allotted_time]`,
            id: `project_tasks_attributes_${i}_allotted_time`,
          },
        }));
      }
    });
  };

  const sortTasks = (tasksToSort: TaskInput[]) => {
    const sorted = [...tasksToSort].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title.value.toLowerCase();
          bValue = b.title.value.toLowerCase();
          break;
        case "allotted_time":
          aValue = parseFloat(a.allottedTime.value) || 0;
          bValue = parseFloat(b.allottedTime.value) || 0;
          break;
        case "created_at":
          aValue = new Date(
            a.taskId
              ? existingTasks.find((t) => t.id === a.taskId)?.created_at || ""
              : ""
          );
          bValue = new Date(
            b.taskId
              ? existingTasks.find((t) => t.id === b.taskId)?.created_at || ""
              : ""
          );
          break;
        default: // position
          aValue = a.position;
          bValue = b.position;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    setIsDragging(true);
    setDraggedTaskId(taskId);
    setDragOverTaskId(null);

    // Create a custom drag image with floating card appearance
    const target = e.currentTarget as HTMLElement;
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.width = target.offsetWidth + "px";
    dragImage.style.backgroundColor = "white";
    dragImage.style.border = "2px solid #e5e7eb";
    dragImage.style.borderRadius = "8px";
    dragImage.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
    dragImage.style.transform = "rotate(3deg) scale(1.05)";
    dragImage.style.opacity = "0.9";
    dragImage.style.zIndex = "9999";
    dragImage.style.pointerEvents = "none";
    dragImage.setAttribute("data-drag-image", "true");

    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(
      dragImage,
      target.offsetWidth / 2,
      target.offsetHeight / 2
    );

    // Remove the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 100);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the task container
    const relatedTarget = e.relatedTarget as Node;
    const currentTarget = e.currentTarget as Node;

    if (
      !relatedTarget ||
      !currentTarget ||
      !currentTarget.contains(relatedTarget)
    ) {
      setDragOverTaskId(null);
      setDropPosition(null);
    }
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the container
    const relatedTarget = e.relatedTarget as Node;
    const currentTarget = e.currentTarget as Node;

    if (
      !relatedTarget ||
      !currentTarget ||
      !currentTarget.contains(relatedTarget)
    ) {
      setDragOverTaskId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropTaskId: string) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("text/plain");

    if (draggedTaskId !== dropTaskId && dropPosition) {
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];

        // Find the indices of the dragged and drop tasks
        const dragIndex = newTasks.findIndex(
          (task) => task.uniqueId === draggedTaskId
        );
        const dropIndex = newTasks.findIndex(
          (task) => task.uniqueId === dropTaskId
        );

        if (dragIndex === -1 || dropIndex === -1) return prevTasks;

        const draggedTask = newTasks[dragIndex];

        // Remove the dragged task first
        newTasks.splice(dragIndex, 1);

        // Calculate the correct drop position
        let adjustedDropIndex = dropIndex;

        if (dropPosition === "below") {
          // If dropping below, insert after the target task
          adjustedDropIndex = dropIndex + 1;
        }
        // If dropping above, insert at the target task's position

        // Adjust for the fact that we removed the dragged task
        if (dragIndex < dropIndex) {
          adjustedDropIndex -= 1;
        }

        // Insert the dragged task at the new position
        newTasks.splice(adjustedDropIndex, 0, draggedTask);

        // Reindex all tasks
        return newTasks.map((task, index) => ({
          ...task,
          formIndex: index,
          position: index,
          title: {
            ...task.title,
            name: `project[tasks_attributes][${index}][title]`,
            id: `project_tasks_attributes_${index}_title`,
          },
          allottedTime: {
            ...task.allottedTime,
            name: `project[tasks_attributes][${index}][allotted_time]`,
            id: `project_tasks_attributes_${index}_allotted_time`,
          },
        }));
      });
    }

    // Reset drag state
    setIsDragging(false);
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setDropPosition(null);
  };

  const saveTaskOrder = async () => {
    const taskIds = tasks
      .filter((task) => task.taskId && !task._destroy)
      .map((task) => task.taskId);

    if (taskIds.length === 0) return;

    try {
      const response = await fetch(sortTasksPath, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token":
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute("content") || "",
        },
        body: JSON.stringify({ task_ids: taskIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to save task order");
      }
    } catch (error) {
      console.error("Error saving task order:", error);
    }
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-8 mt-16 mb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <a
            href={`/projects/${project.id}`}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            data-sg-visit
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Project</span>
          </a>
        </div>

        <Form
          {...form}
          extras={extras}
          validationErrors={errors}
          className="flex flex-col"
          data-sg-remote
        >
          <div className="flex flex-col space-y-2">
            <FieldBase
              {...inputs.name}
              errorKey="name"
              label="Name"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <TextArea
              {...inputs.description}
              type="textarea"
              placeholder="Describe the project in a few words"
              label="Description"
              className="px-3 py-2 border border-gray-300 rounded-lg placeholder:text-sm"
            />
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={addTask}
                    type="button"
                    className="text-indigo-800 font-semibold px-2 flex items-center space-x-1 hover:text-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add task</span>
                  </button>
                </div>
              </div>
              <div
                className="flex flex-col space-y-1 min-h-32"
                onDragOver={handleContainerDragOver}
                onDragLeave={handleContainerDragLeave}
              >
                {sortedTasks.map((task: TaskInput, index: number) => {
                  const isDragged = draggedTaskId === task.uniqueId;
                  const isDragOver = dragOverTaskId === task.uniqueId;
                  const canDrop =
                    isDragging &&
                    draggedTaskId !== null &&
                    draggedTaskId !== task.uniqueId &&
                    sortBy === "position";

                  return (
                    <React.Fragment key={task.taskId || task.id}>
                      {/* Drop zone above the task */}
                      {canDrop && (
                        <div
                          className={`h-8 transition-all duration-200 ${
                            isDragOver && dropPosition === "above"
                              ? "bg-indigo-100 border-2 border-dashed border-indigo-400 rounded-lg flex items-center justify-center"
                              : "hover:bg-gray-50 rounded-lg"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (canDrop) {
                              setDragOverTaskId(task.uniqueId);
                              setDropPosition("above");
                            }
                          }}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, task.uniqueId)}
                        >
                          {isDragOver && dropPosition === "above" && (
                            <div className="text-indigo-600 text-sm font-medium">
                              Drop here to move above
                            </div>
                          )}
                        </div>
                      )}

                      {/* The actual task */}
                      <div
                        className={`flex flex-row space-x-1 items-center py-4 px-3 transition-all duration-200 ease-in-out ${
                          task._destroy ? "opacity-50 line-through" : ""
                        } ${
                          isDragged
                            ? "opacity-20 scale-95 bg-gray-50 rounded-lg shadow-inner transform -rotate-1"
                            : "hover:bg-gray-50 rounded-lg hover:shadow-sm"
                        }`}
                        draggable={sortBy === "position" && !task._destroy}
                        onDragStart={(e) => handleDragStart(e, task.uniqueId)}
                        onDragEnd={handleDragEnd}
                      >
                        {/* Drag handle - only show when sorting by position */}
                        {sortBy === "position" && !task._destroy && (
                          <div
                            className={`flex items-center justify-center w-6 h-6 cursor-move transition-colors ${
                              isDragged
                                ? "text-indigo-500"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                        )}
                        {/* Hidden field for task ID if it exists */}
                        {task.taskId && (
                          <input
                            type="hidden"
                            name={`project[tasks_attributes][${task.formIndex}][id]`}
                            value={task.taskId}
                          />
                        )}
                        {/* Hidden field for _destroy if task is marked for deletion */}
                        {task._destroy && (
                          <input
                            type="hidden"
                            name={`project[tasks_attributes][${task.formIndex}][_destroy]`}
                            value="1"
                          />
                        )}
                        {/* Hidden field for position */}
                        <input
                          type="hidden"
                          name={`project[tasks_attributes][${task.formIndex}][position]`}
                          value={task.position}
                        />
                        <FieldBase
                          key={task.title.id}
                          name={task.title.name}
                          id={task.title.id}
                          type={task.title.type}
                          value={task.title.value}
                          onChange={(e) =>
                            updateTaskField(
                              task.uniqueId,
                              "title",
                              e.target.value
                            )
                          }
                          errorKey="title"
                          label="Task Title"
                          placeholder="Task Title"
                          disabled={task._destroy}
                          className="px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <FieldBase
                          key={task.allottedTime.id}
                          name={task.allottedTime.name}
                          id={task.allottedTime.id}
                          type="number"
                          value={task.allottedTime.value}
                          onChange={(e) =>
                            updateTaskField(
                              task.uniqueId,
                              "allottedTime",
                              e.target.value
                            )
                          }
                          errorKey="allottedTime"
                          label="Alloted Time"
                          placeholder="Alloted Time"
                          disabled={task._destroy}
                          className="px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => removeTask(task.uniqueId)}
                          className={`p-1 ${
                            task._destroy
                              ? "text-green-600 hover:text-green-800"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                          title={task._destroy ? "Restore task" : "Remove task"}
                        >
                          {task._destroy ? (
                            <RotateCcw className="w-5 h-5" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Drop zone below the task (only for the last task) */}
                      {index === sortedTasks.length - 1 && canDrop && (
                        <div
                          className={`h-8 transition-all duration-200 ${
                            isDragOver && dropPosition === "below"
                              ? "bg-indigo-100 border-2 border-dashed border-indigo-400 rounded-lg flex items-center justify-center"
                              : "hover:bg-gray-50 rounded-lg"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (canDrop) {
                              setDragOverTaskId(task.uniqueId);
                              setDropPosition("below");
                            }
                          }}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, task.uniqueId)}
                        >
                          {isDragOver && dropPosition === "below" && (
                            <div className="text-indigo-600 text-sm font-medium">
                              Drop here to move below
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={saveTaskOrder}
              className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-700"
            >
              Save Task Order
            </button>
            <SubmitButton
              text="Update Project"
              type="submit"
              name="commit"
              className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full"
            />
          </div>
        </Form>
      </div>
    </AppLayout>
  );
}
