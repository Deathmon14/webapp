import React, { useState } from 'react';
import { Calendar, Users, Briefcase, Shield, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { users } from '../data/mockData';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roleUsers = {
    client: users.filter(u => u.role === 'client'),
    vendor: users.filter(u => u.role === 'vendor'),
    admin: users.filter(u => u.role === 'admin')
  };

  const roleInfo = {
    client: {
      title: 'Client Portal',
      description: 'Browse and customize event packages',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-600 to-blue-600'
    },
    vendor: {
      title: 'Vendor Dashboard',
      description: 'Manage assigned tasks and events',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-teal-600 to-green-600'
    },
    admin: {
      title: 'Admin Panel',
      description: 'Oversee bookings and vendor assignments',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventEase
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your complete event management platform. Streamline planning, coordination, and execution all in one place.
          </p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(roleInfo).map(([role, info]) => (
              <div
                key={role}
                onClick={() => setSelectedRole(role)}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-purple-200 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                <p className="text-gray-600 mb-6">{info.description}</p>
                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* User Selection */
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedRole('')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className={`w-12 h-12 bg-gradient-to-r ${roleInfo[selectedRole as keyof typeof roleInfo].color} rounded-xl flex items-center justify-center text-white mr-4`}>
                {roleInfo[selectedRole as keyof typeof roleInfo].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {roleInfo[selectedRole as keyof typeof roleInfo].title}
                </h3>
                <p className="text-gray-600">
                  {roleInfo[selectedRole as keyof typeof roleInfo].description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select a demo user to continue:
              </label>
              {roleUsers[selectedRole as keyof typeof roleUsers].map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-purple-700">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Demo Mode:</strong> This is a demonstration with pre-loaded data. 
                No real authentication is required.
              </p>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Smart Planning</h4>
            <p className="text-sm text-gray-600">Intuitive event planning with customizable packages</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Team Coordination</h4>
            <p className="text-sm text-gray-600">Seamless vendor and client communication</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
            <p className="text-sm text-gray-600">Real-time updates and task management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;