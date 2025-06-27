import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Edit, Trash2, BarChart3, AlertCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTask 
        ? `http://localhost:3001/api/tasks/${editingTask.id}`
        : 'http://localhost:3001/api/tasks';
      
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'personal', priority: 'medium' });
    setEditingTask(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'personal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shopping': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Circle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Add New Task
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;