import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, Activity, Eye, EyeOff, Menu, X, Search, Filter, MoreVertical, TrendingUp, Clock, CheckCircle, AlertCircle, LogOut, Plus, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useThreats } from '../../hooks/useThreats';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useEmailService } from '../../hooks/useEmailService';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { threats, loading, updateThreatStatus, simulateThreat } = useThreats();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [notification, setNotification] = useState(null);
  const { sendThreatNotification } = useEmailService(); // Remove this line if not needed

  // Show notification and auto-hide after 5 seconds
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Filter threats based on current filters
  const filteredThreats = threats.filter(threat => {
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || threat.status === filterStatus;
    const matchesSearch = threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.threat_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: threats.length,
    active: threats.filter(t => t.status === 'active').length,
    investigating: threats.filter(t => t.status === 'investigating').length,
    resolved: threats.filter(t => t.status === 'resolved').length,
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    medium: threats.filter(t => t.severity === 'medium').length,
    low: threats.filter(t => t.severity === 'low').length,
  };

  // Chart data
  const chartData = threats.slice(0, 10).map((threat, index) => ({
    name: `T${index + 1}`,
    severity: threat.severity === 'critical' ? 4 : threat.severity === 'high' ? 3 : threat.severity === 'medium' ? 2 : 1,
    harmScore: threat.metadata?.harm_score || Math.floor(Math.random() * 10) + 1,
  }));

  const severityData = [
    { name: 'Critical', value: stats.critical, color: '#ef4444' },
    { name: 'High', value: stats.high, color: '#f97316' },
    { name: 'Medium', value: stats.medium, color: '#eab308' },
    { name: 'Low', value: stats.low, color: '#22c55e' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-400 bg-red-500/20';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      showNotification('error', 'Failed to sign out. Please try again.');
    }
  };

  // FIXED: Removed email sending that was causing the error
  const handleSimulateThreat = async () => {
    try {
      setNotification({ type: 'success', message: 'Simulating threat...' });
      
      const result = await simulateThreat();
      
      if (result && result.success) {
        showNotification('success', 'Threat simulated successfully!');
      } else {
        showNotification('error', result?.error || 'Failed to simulate threat. Please try again.');
      }
    } catch (error) {
      console.error('Error simulating threat:', error);
      showNotification('error', 'Failed to simulate threat. Please try again.');
    }
  };

  // Enhanced update threat status function with proper error handling
  const handleUpdateThreatStatus = async (threatId, newStatus) => {
    try {
      console.log(`Updating threat ${threatId} to ${newStatus}`);
      
      // Check if updateThreatStatus function exists
      if (!updateThreatStatus) {
        throw new Error('updateThreatStatus function is not available');
      }
      
      const result = await updateThreatStatus(threatId, newStatus);
      
      if (result && result.success) {
        showNotification('success', `Threat status updated to ${newStatus}`);
      } else {
        showNotification('error', result?.error || `Failed to update threat status to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating threat status:', error);
      showNotification('error', `Failed to update threat status: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500/20 text-green-300 border-green-500/50' 
            : 'bg-red-500/20 text-red-300 border-red-500/50'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">ShieldNet AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-6">
          <div className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-blue-600/20 text-blue-300 rounded-lg">
              <Activity className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.email}</p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSimulateThreat}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
              >
                <Zap className="h-4 w-4" />
                <span>Simulate Threat</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Threats</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Threats</p>
                  <p className="text-3xl font-bold text-red-400">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Investigating</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.investigating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Resolved</p>
                  <p className="text-3xl font-bold text-green-400">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Threat Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="harmScore" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search threats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Threats List */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Recent Threats</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-slate-400 mt-2">Loading threats...</p>
              </div>
            ) : filteredThreats.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No threats found matching your criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {filteredThreats.map((threat) => (
                  <div key={threat.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                            {threat.status.toUpperCase()}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {format(new Date(threat.created_at || threat.detected_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <h4 className="text-white font-medium mb-1">{threat.threat_type}</h4>
                        <p className="text-slate-400 text-sm mb-2">{threat.description}</p>
                        {threat.metadata && (
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            {threat.metadata.ip_address && (
                              <span>IP: {threat.metadata.ip_address}</span>
                            )}
                            {threat.metadata.harm_score && (
                              <span>Harm Score: {threat.metadata.harm_score}/10</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {threat.status !== 'resolved' && (
                          <>
                            {threat.status === 'active' && (
                              <button
                                onClick={() => handleUpdateThreatStatus(threat.id, 'investigating')}
                                className="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 rounded text-yellow-300 text-sm transition-colors"
                              >
                                Investigate
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateThreatStatus(threat.id, 'resolved')}
                              className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded text-green-300 text-sm transition-colors"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}