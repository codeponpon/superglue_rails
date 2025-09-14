import React, { useState, useEffect } from "react";
import { useContent } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import {
  Form,
  FieldBase,
  TextArea,
  SubmitButton,
} from "../../frontend/components/Inputs";
import { Plus, Trash2, ArrowLeft, RotateCcw } from "lucide-react";

interface FormData {
  action: string;
  method: string;
  authenticity_token: string;
}

interface InputData {
  name: string;
  value: string;
  defaultValue: string;
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
}

export default function ProjectsEdit() {
  const {
    edit_project_form,
    project,
    tasks: existingTasks,
  } = useContent<ProjectEditContent>();
  const { form, extras, inputs, errors } = edit_project_form;

  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [taskCounter, setTaskCounter] = useState(0);

  useEffect(() => {
    // Map existing tasks with their IDs to the form structure
    const mappedTasks =
      inputs.tasksAttributes?.map((taskInput, index) => {
        const existingTask = existingTasks[index];
        return {
          ...taskInput,
          taskId: existingTask?.id,
          formIndex: index, // Use the original form index
        };
      }) || [];
    setTasks(mappedTasks);
    // Set task counter to continue from existing tasks count
    setTaskCounter(mappedTasks.length);
  }, [inputs.tasksAttributes, existingTasks]);

  const updateTaskField = (
    taskIndex: number,
    field: "title" | "allottedTime",
    value: string
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === taskIndex
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

  const removeTask = (index: number) => {
    setTasks((prevTasks) => {
      const taskToRemove = prevTasks[index];

      // If task is already marked for destruction, restore it
      if (taskToRemove._destroy) {
        return prevTasks.map((task, i) =>
          i === index ? { ...task, _destroy: false } : task
        );
      }

      // If it's an existing task (has taskId), mark it for destruction
      if (taskToRemove.taskId) {
        return prevTasks.map((task, i) =>
          i === index ? { ...task, _destroy: true } : task
        );
      } else {
        // If it's a new task (no taskId), remove it and reindex remaining tasks
        const filteredTasks = prevTasks.filter((_, i) => i !== index);
        return filteredTasks.map((task, i) => ({
          ...task,
          formIndex: i,
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

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-8 mt-16 mb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <a
            href={`/projects/${project.id}`}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
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
                <button
                  onClick={addTask}
                  type="button"
                  className="text-indigo-800 font-semibold px-2 flex items-center space-x-1 hover:text-indigo-600"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add task</span>
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                {tasks.map((task: TaskInput, index: number) => (
                  <div
                    className={`flex flex-row space-x-1 items-center ${
                      task._destroy ? "opacity-50 line-through" : ""
                    }`}
                    key={index}
                  >
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
                    <FieldBase
                      key={task.title.id}
                      name={task.title.name}
                      id={task.title.id}
                      defaultValue={task.title.defaultValue}
                      type={task.title.type}
                      value={task.title.value}
                      onChange={(e) =>
                        updateTaskField(index, "title", e.target.value)
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
                      defaultValue={task.allottedTime.defaultValue}
                      type="number"
                      value={task.allottedTime.value}
                      onChange={(e) =>
                        updateTaskField(index, "allottedTime", e.target.value)
                      }
                      errorKey="allottedTime"
                      label="Alloted Time"
                      placeholder="Alloted Time"
                      disabled={task._destroy}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
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
                ))}
              </div>
            </div>
          </div>
          <SubmitButton
            text="Update Project"
            type="submit"
            name="commit"
            className="bg-indigo-700 text-white font-semibold mt-8 py-2 px-6 rounded-full"
          />
        </Form>
      </div>
    </AppLayout>
  );
}
