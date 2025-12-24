import React, { useState } from 'react';
import { Shield, Eye, Brain, Zap, Users, Lock, ArrowRight, CheckCircle, Star, Globe, TrendingUp } from 'lucide-react';
import AuthForm from './Auth/AuthForm';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };
  
  if (showAuth) {
    return <AuthForm mode={authMode} onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="h-10 w-10 text-blue-400" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ShieldNet AI
          </span>
        </div>
        <button
          onClick={handleSignIn}
          className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-300 transition-all duration-300 hover:scale-105"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Advanced AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cybersecurity Platform
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Revolutionary intrusive activity detection system for social media platforms. 
            Protect your digital ecosystem with real-time AI monitoring and automated response capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-slate-600 hover:border-blue-500 rounded-xl text-slate-300 hover:text-white font-semibold text-lg transition-all duration-300 hover:bg-blue-500/10">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-slate-400">Threat Detection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt;1ms</div>
              <div className="text-slate-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-400">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Cutting-Edge Security Features
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Comprehensive protection powered by advanced AI algorithms and real-time threat intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI-Powered Detection",
              description: "Advanced machine learning algorithms that adapt and learn from new threat patterns in real-time.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Eye,
              title: "Real-time Monitoring",
              description: "Continuous surveillance of social media activities with instant threat identification and alerts.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Zap,
              title: "Instant Response",
              description: "Automated threat mitigation and response systems that act within milliseconds of detection.",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Multi-user dashboard with role-based access control and collaborative threat management.",
              color: "from-orange-500 to-red-500"
            },
            {
              icon: Lock,
              title: "Enterprise Security",
              description: "Bank-grade encryption and security protocols with compliance to industry standards.",
              color: "from-indigo-500 to-purple-500"
            },
            {
              icon: TrendingUp,
              title: "Advanced Analytics",
              description: "Comprehensive reporting and analytics with predictive threat modeling capabilities.",
              color: "from-teal-500 to-blue-500"
            }
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
              <div className="relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-32 text-center">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Ready to Secure Your Platform?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already protecting their digital assets with ShieldNet AI
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3 mx-auto"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}