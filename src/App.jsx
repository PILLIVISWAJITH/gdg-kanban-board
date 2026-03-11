import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialData = {
  todo: { id: 'todo', title: 'Todo', tasks: [] },
  inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
  done: { id: 'done', title: 'Done', tasks: [] }
};

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('kanban-tasks');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(data));
  }, [data]);

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = { id: uuidv4(), title, desc };
    setData({
      ...data,
      todo: { ...data.todo, tasks: [...data.todo.tasks, newTask] }
    });
    setTitle('');
    setDesc('');
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const startCol = data[source.droppableId];
    const endCol = data[destination.droppableId];

    if (startCol === endCol) {
      const newTasks = Array.from(startCol.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);
      setData({ ...data, [source.droppableId]: { ...startCol, tasks: newTasks } });
    } else {
      const startTasks = Array.from(startCol.tasks);
      const [removed] = startTasks.splice(source.index, 1);
      const endTasks = Array.from(endCol.tasks);
      endTasks.splice(destination.index, 0, removed);
      setData({
        ...data,
        [source.droppableId]: { ...startCol, tasks: startTasks },
        [destination.droppableId]: { ...endCol, tasks: endTasks }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">GDG Kanban Task Manager</h1>

      <form onSubmit={addTask} className="max-w-2xl mx-auto mb-10 bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (Optional)" className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Add to Todo</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          {Object.entries(data).map(([id, column]) => (
            <div key={id} className="bg-gray-200 p-4 rounded-xl w-full md:w-80 shadow-inner">
              <h2 className="font-bold text-gray-600 mb-4 uppercase tracking-wider">{column.title}</h2>
              <Droppable droppableId={id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                            <h3 className="font-bold text-gray-800">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.desc}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
