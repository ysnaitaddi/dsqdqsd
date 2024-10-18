import { useState } from 'react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  editTask: (task: Task) => void;
  selectedDate: Date;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, addTask, deleteTask, editTask, selectedDate }) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    date: selectedDate,
    startTime: '',
    endTime: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.date && newTask.startTime && newTask.endTime) {
      addTask({
        id: Date.now().toString(),
        ...newTask as Task,
      });
      setNewTask({
        title: '',
        date: selectedDate,
        startTime: '',
        endTime: '',
      });
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          value={format(newTask.date || selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setNewTask({ ...newTask, date: new Date(e.target.value) })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="time"
          placeholder="Start time"
          value={newTask.startTime}
          onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="time"
          placeholder="End time"
          value={newTask.endTime}
          onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Add Task
        </button>
      </form>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <Droppable droppableId="taskList">
        {(provided: DroppableProvided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided: DraggableProvided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded shadow"
                  >
                    <h3 className="font-bold">{task.title}</h3>
                    <p>{format(task.date, 'MMMM d, yyyy')}</p>
                    <p>
                      {task.startTime} - {task.endTime}
                    </p>
                    <div className="mt-2">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          const updatedTask = { ...task, title: prompt('Edit task title:', task.title) || task.title };
                          editTask(updatedTask);
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
