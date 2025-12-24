import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Activity, Eye, EyeOff, Menu, X, Search, Filter, MoreVertical, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useThreats } from './hooks/useThreats';
import LandingPage from './components/LandingPage';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

export default App;