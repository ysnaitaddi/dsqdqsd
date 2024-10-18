import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Dashboard from '../components/Dashboard';
import Schedule from '../components/Schedule';
import TaskList from '../components/TaskList';
import { Task } from '../types';

const ScheduleApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    setTasks((prevTasks) => {
      const updatedTasks = Array.from(prevTasks);
      const [reorderedTask] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, reorderedTask);

      return updatedTasks;
    });
  };

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const editTask = (editedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === editedTask.id ? editedTask : task)));
  };

  const duplicateTask = (taskId: string, newDate: Date) => {
    const taskToDuplicate = tasks.find((task) => task.id === taskId);
    if (taskToDuplicate) {
      const newTask = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        date: newDate,
      };
      setTasks([...tasks, newTask]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Schedule App</h1>
      <Dashboard tasks={tasks} />
      <div className="flex flex-col md:flex-row gap-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="w-full md:w-2/3">
            <Schedule
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onDuplicateTask={duplicateTask}
            />
          </div>
          <div className="w-full md:w-1/3">
            <TaskList
              tasks={tasks}
              addTask={addTask}
              deleteTask={deleteTask}
              editTask={editTask}
              selectedDate={selectedDate}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ScheduleApp;
