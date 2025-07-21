import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText, User } from 'lucide-react';
import { User as UserType, VendorTask } from '../types';
import { vendorTasks } from '../data/mockData';

interface VendorDashboardProps {
  user: UserType;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<VendorTask[]>(
    vendorTasks.filter(task => task.vendorId === user.id)
  );
  const [selectedTask, setSelectedTask] = useState<VendorTask | null>(null);

  const updateTaskStatus = (taskId: string, newStatus: VendorTask['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusIcon = (status: VendorTask['status']) => {
    switch (status) {
      case 'assigned':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: VendorTask['status']) => {
    switch (status) {
      case 'assigned':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h2>
        <p className="text-gray-600">
          Manage your assigned tasks and update event progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-orange-600">{stats.assigned}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tasks List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Tasks</h3>
          
          <div className="space-y-4">
            {tasks.map((task) => {
              const daysUntil = getDaysUntil(task.eventDate);
              const isUrgent = daysUntil <= 7 && task.status !== 'completed';

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTask?.id === task.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(task.eventDate)}</span>
                        {isUrgent && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Due in {daysUntil} days
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusIcon(task.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm font-medium text-purple-600 capitalize">
                      {task.category}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned yet</h4>
                <p className="text-gray-600">New tasks will appear here when they're assigned to you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Task Details</h3>
          
          {selectedTask ? (
            <div className="space-y-6">
              {/* Task Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-gray-600 mb-4">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(selectedTask.eventDate)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="flex items-center text-sm text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Requirements
                </label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    {selectedTask.clientRequirements || 'No specific requirements provided.'}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Update Status
                </label>
                <div className="space-y-3">
                  {(['assigned', 'in-progress', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTaskStatus(selectedTask.id, status)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedTask.status === status
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <span className="ml-3 font-medium">
                          {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {selectedTask.status === status && (
                          <CheckCircle className="w-5 h-5 text-purple-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-1">Progress Updates</h5>
                    <p className="text-sm text-blue-700">
                      Status changes are automatically saved and visible to the event admin and client.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Select a task</h4>
              <p className="text-gray-600">Choose a task from the list to view details and update status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;