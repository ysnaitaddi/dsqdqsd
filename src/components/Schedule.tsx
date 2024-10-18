import { useState } from 'react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { Task } from '../types';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

interface ScheduleProps {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDuplicateTask: (taskId: string, newDate: Date) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ tasks, selectedDate, setSelectedDate, onDuplicateTask }) => {
  const [view, setView] = useState<'day' | 'week'>('week');

  const timeSlots = Array.from({ length: 35 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (e.altKey) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, duplicate: true }));
    } else {
      e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, duplicate: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, date: Date, time: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { taskId, duplicate } = data;

    if (duplicate) {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      onDuplicateTask(taskId, newDate);
    }
  };

  const renderDayView = () => (
    <div className="grid grid-cols-[auto,1fr] gap-2">
      {timeSlots.map((time) => (
        <React.Fragment key={time}>
          <div className="text-right pr-2">{time}</div>
          <Droppable droppableId={`${selectedDate.toISOString()}-${time}`}>
            {(provided: DroppableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 h-12 rounded"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, selectedDate, time)}
              >
                {tasks
                  .filter(
                    (task) =>
                      task.date.toDateString() === selectedDate.toDateString() &&
                      task.startTime === time
                  )
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-200 p-1 rounded text-sm"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </React.Fragment>
      ))}
    </div>
  );

  const renderWeekView = () => (
    <div className="grid grid-cols-[auto,repeat(7,1fr)] gap-2">
      <div></div>
      {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((date) => (
        <div key={date.toISOString()} className="text-center font-bold">
          {format(date, 'EEE dd/MM')}
        </div>
      ))}
      {timeSlots.map((time) => (
        <React.Fragment key={time}>
          <div className="text-right pr-2">{time}</div>
          {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((date) => (
            <Droppable key={date.toISOString()} droppableId={`${date.toISOString()}-${time}`}>
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 h-12 rounded"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, date, time)}
                >
                  {tasks
                    .filter(
                      (task) =>
                        task.date.toDateString() === date.toDateString() && task.startTime === time
                    )
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-blue-200 p-1 rounded text-sm"
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <div>
          <button
            className={`mr-2 px-4 py-2 rounded ${
              view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setView('day')}
          >
            Day
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setView('week')}
          >
            Week
          </button>
        </div>
      </div>
      <div className="mb-4">
        <button
          className="mr-2 px-4 py-2 bg-gray-200 rounded"
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        >
          Previous
        </button>
        <span className="font-bold">
          {view === 'day'
            ? format(selectedDate, 'MMMM d, yyyy')
            : `${format(weekStart, 'MMMM d')} - ${format(weekEnd, 'MMMM d, yyyy')}`}
        </span>
        <button
          className="ml-2 px-4 py-2 bg-gray-200 rounded"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto">{view === 'day' ? renderDayView() : renderWeekView()}</div>
    </div>
  );
};

export default Schedule;
