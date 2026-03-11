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
    const saved = localStorage.getItem('kanban-v4');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-v4');
    return saved ? JSON.parse(saved) : false;
  });

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('kanban-v4', JSON.stringify(data));
    localStorage.setItem('theme-v4', JSON.stringify(isDark));
  }, [data, isDark]);

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
    const start = data[source.droppableId];
    const end = data[destination.droppableId];
    if (start === end) {
      const newList = Array.from(start.tasks);
      const [moved] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, moved);
      setData({...data, [source.droppableId]: {...start, tasks: newList}});
    } else {
      const sList = Array.from(start.tasks);
      const [moved] = sList.splice(source.index, 1);
      const eList = Array.from(end.tasks);
      eList.splice(destination.index, 0, moved);
      setData({...data, [source.droppableId]: {...start, tasks: sList}, [destination.droppableId]: {...end, tasks: eList}});
    }
  };

  const editTask = (colId, taskId) => {
    const task = data[colId].tasks.find(t => t.id === taskId);
    const newTitle = prompt("Edit Task Title:", task.title);
    const newDesc = prompt("Edit Description:", task.desc);
    if (newTitle) {
      const updated = data[colId].tasks.map(t => t.id === taskId ? { ...t, title: newTitle, desc: newDesc } : t);
      setData({ ...data, [colId]: { ...data[colId], tasks: updated } });
    }
  };

  const deleteTask = (colId, taskId) => {
    const newTasks = data[colId].tasks.filter(t => t.id !== taskId);
    setData({ ...data, [colId]: { ...data[colId], tasks: newTasks } });
  };

  return (
    <div className={`min-h-screen relative transition-all duration-700 font-sans ${isDark ? 'text-cyan-100' : 'text-white'}`}>
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000" 
        style={{ backgroundImage: isDark ? "url('/bg-dark.jpg')" : "url('/bg-light.jpg')" }}
      />
      <div className={`fixed inset-0 z-0 backdrop-blur-[3px] ${isDark ? 'bg-black/70' : 'bg-black/30'}`} />

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter drop-shadow-2xl italic">GDG KANBAN</h1>
          <button onClick={() => setIsDark(!isDark)} className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all shadow-2xl active:scale-90">
            {isDark ? '🌙' : '☀️'}
          </button>
        </header>

        <form onSubmit={addTask} className="max-w-2xl mx-auto mb-16 p-6 rounded-[2.5rem] bg-white/10 border border-white/20 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task Title" className="flex-1 p-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="flex-1 p-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95">ADD</button>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            {Object.entries(data).map(([id, col]) => (
              <div key={id} className={`w-full md:w-80 p-6 rounded-[3rem] border backdrop-blur-xl shadow-2xl min-h-[550px] transition-all ${isDark ? 'bg-slate-900/50 border-blue-500/20' : 'bg-black/30 border-white/20'}`}>
                <div className="flex justify-between items-center mb-10 px-4">
                  <h2 className={`font-black text-[10px] uppercase tracking-[0.3em] opacity-80 ${isDark ? 'text-blue-400' : 'text-cyan-300'}`}>{col.title}</h2>
                  <span className="bg-white/10 text-[10px] px-3 py-1 rounded-full font-bold border border-white/10">{col.tasks.length}</span>
                </div>
                <Droppable droppableId={id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-[450px]">
                      {col.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 text-white backdrop-blur-2xl shadow-xl transition-all hover:bg-white/10">
                              <h3 className="font-bold text-sm mb-1">{task.title}</h3>
                              <p className="text-[11px] opacity-60 leading-relaxed line-clamp-2">{task.desc}</p>
                              <div className="flex gap-3 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => editTask(id, task.id)} className="text-blue-400 hover:text-blue-300 font-bold text-xs">✎</button>
                                <button onClick={() => deleteTask(id, task.id)} className="text-red-500 hover:text-red-400 font-bold text-xs">×</button>
                              </div>
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
    </div>
  );
}

export default App;
