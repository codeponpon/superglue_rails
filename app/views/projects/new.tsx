import React, { useState, useEffect } from "react";
import { useContent } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import {
  Form,
  FieldBase,
  TextArea,
  SubmitButton,
} from "../../frontend/components/Inputs";
import { Plus, Trash2 } from "lucide-react";

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
  title: InputData;
  allottedTime: InputData;
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

interface ProjectNewContent {
  new_project_form: {
    form: FormData;
    extras: FormExtras;
    inputs: FormInputs;
    errors: ValidationErrors;
  };
}

export default function ProjectsNew() {
  const formContent = useContent<ProjectNewContent>();
  const { form, extras, inputs, errors } = formContent.new_project_form;

  const [tasks, setTasks] = useState<TaskInput[]>(inputs.tasksAttributes || []);
  const [taskCounter, setTaskCounter] = useState(0);

  useEffect(() => {
    setTasks(inputs.tasksAttributes || []);
  }, [inputs.tasksAttributes]);

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
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  console.log(inputs);
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-8 mt-16 mb-24">
        <h1 className="text-2xl font-bold mb-4">New Project</h1>
        <Form
          {...form}
          extras={extras}
          validationErrors={errors}
          className="flex flex-col"
          data-sg-visit
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
                    className="flex flex-row space-x-1 items-center"
                    key={index}
                  >
                    <FieldBase
                      name={task.title.name}
                      id={task.title.id}
                      type={task.title.type}
                      value={task.title.value}
                      onChange={(e) =>
                        updateTaskField(index, "title", e.target.value)
                      }
                      errorKey="title"
                      label="Task Title"
                      placeholder="Task Title"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <FieldBase
                      name={task.allottedTime.name}
                      id={task.allottedTime.id}
                      type="number"
                      value={task.allottedTime.value}
                      onChange={(e) =>
                        updateTaskField(index, "allottedTime", e.target.value)
                      }
                      errorKey="allottedTime"
                      label="Alloted Time"
                      placeholder="Alloted Time"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-gray-500 cursor-pointer hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SubmitButton
            text="Create Project"
            type="submit"
            name="commit"
            className="bg-indigo-700 text-white font-semibold mt-8 py-2 px-6 rounded-full"
          />
        </Form>
      </div>
    </AppLayout>
  );
}
