import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Shield, Crown, User, Mail, Calendar, Activity, Star, Award, Zap, Globe, X, Check, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'analyst' | 'user';
  created_at: string;
  updated_at: string;
  last_sign_in?: string;
  threat_count?: number;
  status?: 'online' | 'offline' | 'away';
  avatar_color?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', role: 'user' });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const avatarColors = [
        'from-blue-500 to-purple-600', 
        'from-green-500 to-teal-600', 
        'from-pink-500 to-rose-600', 
        'from-yellow-500 to-orange-600', 
        'from-indigo-500 to-blue-600',
        'from-purple-500 to-pink-600',
        'from-teal-500 to-cyan-600',
        'from-red-500 to-orange-600'
      ];
      const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
      
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          email: 'admin@cyberguard.ai',
          full_name: 'Alex Rodriguez',
          role: 'admin',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          last_sign_in: '2024-01-16T09:30:00Z',
          threat_count: 145,
          status: 'online',
          avatar_color: avatarColors[0]
        },
        {
          id: '2',
          email: 'sarah.chen@cyberguard.ai',
          full_name: 'Sarah Chen',
          role: 'analyst',
          created_at: '2024-01-16T14:20:00Z',
          updated_at: '2024-01-16T14:20:00Z',
          last_sign_in: '2024-01-16T08:15:00Z',
          threat_count: 89,
          status: 'online',
          avatar_color: avatarColors[1]
        },
        {
          id: '3',
          email: 'mike.johnson@company.com',
          full_name: 'Mike Johnson',
          role: 'user',
          created_at: '2024-01-17T11:45:00Z',
          updated_at: '2024-01-17T11:45:00Z',
          last_sign_in: '2024-01-16T16:22:00Z',
          threat_count: 23,
          status: 'away',
          avatar_color: avatarColors[2]
        },
        {
          id: '4',
          email: 'emma.davis@company.com',
          full_name: 'Emma Davis',
          role: 'analyst',
          created_at: '2024-01-18T09:30:00Z',
          updated_at: '2024-01-18T09:30:00Z',
          last_sign_in: '2024-01-16T14:10:00Z',
          threat_count: 67,
          status: 'online',
          avatar_color: avatarColors[3]
        },
        {
          id: '5',
          email: 'david.wilson@company.com',
          full_name: 'David Wilson',
          role: 'user',
          created_at: '2024-01-19T13:15:00Z',
          updated_at: '2024-01-19T13:15:00Z',
          last_sign_in: '2024-01-16T11:45:00Z',
          threat_count: 12,
          status: 'offline',
          avatar_color: avatarColors[4]
        },
        {
          id: '6',
          email: 'lisa.martinez@company.com',
          full_name: 'Lisa Martinez',
          role: 'admin',
          created_at: '2024-01-20T16:30:00Z',
          updated_at: '2024-01-20T16:30:00Z',
          last_sign_in: '2024-01-16T13:20:00Z',
          threat_count: 98,
          status: 'online',
          avatar_color: avatarColors[5]
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    setIsInviting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new user to the list
      const newUser: UserProfile = {
        id: Date.now().toString(),
        email: inviteForm.email,
        full_name: inviteForm.name,
        role: inviteForm.role as 'admin' | 'analyst' | 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        threat_count: 0,
        status: 'offline',
        avatar_color: 'from-slate-500 to-slate-600'
      };
      
      setUsers(prev => [newUser, ...prev]);
      setShowInviteModal(false);
      setInviteForm({ email: '', name: '', role: 'user' });
    } catch (error) {
      console.error('Error inviting member:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin': 
        return { 
          color: 'from-red-500 to-pink-600', 
          icon: Crown, 
          badge: 'bg-red-500/20 text-red-300 border-red-500/50',
          title: 'System Administrator'
        };
      case 'analyst': 
        return { 
          color: 'from-blue-500 to-cyan-600', 
          icon: Shield, 
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          title: 'Security Analyst'
        };
      case 'user': 
        return { 
          color: 'from-green-500 to-emerald-600', 
          icon: User, 
          badge: 'bg-green-500/20 text-green-300 border-green-500/50',
          title: 'Team Member'
        };
      default: 
        return { 
          color: 'from-slate-500 to-slate-600', 
          icon: User, 
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
          title: 'User'
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'online': return { color: 'bg-green-500', text: 'Online', pulse: 'animate-pulse' };
      case 'away': return { color: 'bg-yellow-500', text: 'Away', pulse: '' };
      case 'offline': return { color: 'bg-slate-500', text: 'Offline', pulse: '' };
      default: return { color: 'bg-slate-500', text: 'Unknown', pulse: '' };
    }
  };

  const stats = {
    total: users.length,
    online: users.filter(u => u.status === 'online').length,
    admins: users.filter(u => u.role === 'admin').length,
    analysts: users.filter(u => u.role === 'analyst').length,
    users: users.filter(u => u.role === 'user').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Team Central
              </h1>
              <p className="text-purple-300 text-lg mt-2">Manage your security team and permissions</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">{stats.online} Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm">{stats.total} Total Members</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowInviteModal(true)}
              className="group relative flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/30"
            >
              <UserPlus className="h-6 w-6 group-hover:animate-bounce" />
              <span>Invite Member</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Members', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-700', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
            { label: 'Online Now', value: stats.online, icon: Globe, color: 'from-green-500 to-green-700', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
            { label: 'Administrators', value: stats.admins, icon: Crown, color: 'from-red-500 to-red-700', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
            { label: 'Analysts', value: stats.analysts, icon: Shield, color: 'from-purple-500 to-purple-700', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
            { label: 'Team Members', value: stats.users, icon: User, color: 'from-indigo-500 to-indigo-700', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30' }
          ].map((stat, index) => (
            <div key={index} className={`${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-purple-400 text-xs">+{Math.floor(Math.random() * 10)}% growth</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white/10 border border-purple-500/50 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-96 text-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-6 py-4 bg-white/10 border border-purple-500/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              >
                <option value="all">All Roles</option>
                <option value="admin">👑 Administrators</option>
                <option value="analyst">🛡️ Analysts</option>
                <option value="user">👤 Team Members</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Users Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="text-purple-300 text-xl mt-6 font-medium">Loading team members...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-24 w-24 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-300 text-2xl font-bold">No team members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              const statusInfo = getStatusInfo(user.status || 'offline');
              const RoleIcon = roleInfo.icon;
              
              return (
                <div key={user.id} className="group relative">
                  <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                    {/* Enhanced Status Indicator */}
                    <div className="absolute top-6 right-6 flex items-center space-x-3">
                      <div className={`w-4 h-4 ${statusInfo.color} rounded-full ${statusInfo.pulse}`}></div>
                      <span className="text-purple-300 text-sm font-medium">{statusInfo.text}</span>
                    </div>
                    
                    {/* Enhanced Avatar */}
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-r ${user.avatar_color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                          <span className="text-white font-bold text-2xl">
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <RoleIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{user.full_name}</h3>
                        <p className="text-purple-300 text-lg">{roleInfo.title}</p>
                      </div>
                    </div>
                    
                    {/* Enhanced Role Badge */}
                    <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-2xl text-sm font-bold border ${roleInfo.badge} mb-6`}>
                      <RoleIcon className="h-4 w-4" />
                      <span>{user.role.toUpperCase()}</span>
                    </div>
                    
                    {/* Enhanced User Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-3 text-purple-200">
                        <Mail className="h-5 w-5 text-purple-400" />
                        <span className="text-base">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-purple-200">
                        <Calendar className="h-5 w-5 text-purple-400" />
                        <span className="text-base">Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-purple-200">
                        <Activity className="h-5 w-5 text-purple-400" />
                        <span className="text-base">{user.threat_count} threats handled</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Performance Badge */}
                    {user.threat_count && user.threat_count > 50 && (
                      <div className="flex items-center space-x-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-2xl text-yellow-300 text-sm font-bold mb-6">
                        <Star className="h-4 w-4" />
                        <span>⭐ Top Performer</span>
                      </div>
                    )}
                    
                    {/* Enhanced Actions */}
                    <div className="flex items-center space-x-3">
                      <button className="flex-1 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 hover:border-purple-400 rounded-2xl text-purple-300 text-base font-medium transition-all duration-300 hover:scale-105">
                        View Profile
                      </button>
                      <button className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 hover:border-blue-400 rounded-2xl text-blue-300 text-base font-medium transition-all duration-300 hover:scale-105">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="user">👤 Team Member</option>
                  <option value="analyst">🛡️ Security Analyst</option>
                  <option value="admin">👑 Administrator</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-6 py-3 bg-slate-600/50 hover:bg-slate-500/50 rounded-2xl text-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={isInviting || !inviteForm.email || !inviteForm.name}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isInviting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}