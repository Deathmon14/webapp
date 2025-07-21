import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  UserCheck,
  ArrowRight,
  Settings
} from 'lucide-react';
import { User, BookingRequest, VendorAssignment } from '../types';
import { bookingRequests, users, vendorTasks } from '../data/mockData';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [bookings, setBookings] = useState<BookingRequest[]>(bookingRequests);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [vendorAssignments, setVendorAssignments] = useState<{[bookingId: string]: VendorAssignment[]}>({
    '1': [
      { vendorId: '3', vendorName: 'Emma Photography', category: 'photography', status: 'in-progress' },
      { vendorId: '4', vendorName: 'David Catering Co.', category: 'catering', status: 'assigned' }
    ],
    '2': [
      { vendorId: '4', vendorName: 'David Catering Co.', category: 'catering', status: 'assigned' }
    ]
  });

  const vendors = users.filter(u => u.role === 'vendor');

  const updateBookingStatus = (bookingId: string, newStatus: BookingRequest['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const assignVendor = (bookingId: string, vendorId: string, category: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    setVendorAssignments(prev => ({
      ...prev,
      [bookingId]: [
        ...(prev[bookingId] || []).filter(a => a.category !== category),
        { vendorId, vendorName: vendor.name, category, status: 'assigned' }
      ]
    }));
  };

  const getStatusIcon = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'in-progress':
        return <Settings className="w-5 h-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 border-purple-200';
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

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    activeVendors: vendors.length
  };

  const getRequiredCategories = (booking: BookingRequest) => {
    const categories = ['venue', 'catering', 'decoration', 'entertainment', 'photography'];
    return booking.customizations.map(c => c.category).filter((cat, index, arr) => 
      arr.indexOf(cat) === index
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Manage bookings, assign vendors, and track event progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeVendors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h3>
          
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedBooking?.id === booking.id
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-gray-900 mr-3">{booking.packageName}</h4>
                      {getStatusIcon(booking.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Client: {booking.clientName}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(booking.eventDate)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${booking.totalPrice.toLocaleString()}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                
                {/* Vendor Assignment Progress */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center text-sm">
                    <UserCheck className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-600">
                      Vendors: {vendorAssignments[booking.id]?.length || 0} assigned
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details & Vendor Assignment */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Management</h3>
          
          {selectedBooking ? (
            <div className="space-y-6">
              {/* Booking Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedBooking.packageName}</h4>
                <p className="text-sm text-gray-600 mb-3">Client: {selectedBooking.clientName}</p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Event Details</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedBooking.eventDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">${selectedBooking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Client Requirements */}
                {selectedBooking.requirements && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h5 className="font-medium text-blue-900 mb-2">Client Requirements</h5>
                    <p className="text-sm text-blue-700">{selectedBooking.requirements}</p>
                  </div>
                )}
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Booking Status
                </label>
                <div className="space-y-2">
                  {(['pending', 'confirmed', 'in-progress', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateBookingStatus(selectedBooking.id, status)}
                      className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                        selectedBooking.status === status
                          ? 'border-purple-300 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(status)}
                        <span className="ml-3 font-medium">
                          {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vendor Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vendor Assignments
                </label>
                <div className="space-y-3">
                  {getRequiredCategories(selectedBooking).map((category) => {
                    const assignment = vendorAssignments[selectedBooking.id]?.find(a => a.category === category);
                    
                    return (
                      <div key={category} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 capitalize">{category}</span>
                          {assignment && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Assigned
                            </span>
                          )}
                        </div>
                        
                        {assignment ? (
                          <p className="text-sm text-gray-600">{assignment.vendorName}</p>
                        ) : (
                          <select
                            onChange={(e) => assignVendor(selectedBooking.id, e.target.value, category)}
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            defaultValue=""
                          >
                            <option value="">Select vendor...</option>
                            {vendors.map((vendor) => (
                              <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Select a booking</h4>
              <p className="text-gray-600">Choose a booking from the list to manage details and assign vendors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;