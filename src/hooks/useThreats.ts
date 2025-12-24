import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useEmailService } from './useEmailService';
import { useAuth } from './useAuth';

export function useThreats() {
  const { user } = useAuth();
  const { sendThreatNotificationToAdmin, sendThreatNotificationToUser } = useEmailService();
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThreats();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('threats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'threats' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setThreats(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setThreats(prev => prev.map(threat => 
              threat.id === payload.new.id ? payload.new : threat
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchThreats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreats(data || []);
    } catch (error) {
      console.error('Error fetching threats:', error);
      setError('Failed to load threats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ADD THIS FUNCTION - Update threat status
  // Add this function to your useThreats hook
const updateThreatStatus = async (threatId, newStatus) => {
  try {
    console.log(`Updating threat ${threatId} to status: ${newStatus}`);
    
    const { data, error } = await supabase
      .from('threats')
      .update({ 
        status: newStatus
      })
      .eq('id', threatId)
      .select()
      .single();

    if (error) throw error;

    console.log('Threat status updated successfully:', data);
    
    // Update local state
    setThreats(prev => prev.map(threat => 
      threat.id === threatId ? { ...threat, status: newStatus } : threat
    ));

    return { success: true, threat: data };
  } catch (error) {
    console.error('Error updating threat status:', error);
    const errorMessage = `Failed to update threat status: ${error.message}`;
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }
};

  const simulateThreat = async () => {
  try {
    setError(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Please sign in to simulate threats');

    const threatTypes = ['Malware', 'Phishing', 'Data Breach', 'DDoS Attack', 'Social Engineering'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const descriptions = [
      'Suspicious login attempt detected',
      'Malicious file upload detected',
      'Unusual data access pattern',
      'Potential bot activity detected',
      'Suspicious API calls detected'
    ];

    const randomThreat = {
      threat_type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: 'active',
      user_id: session.user.id,
      created_at: new Date().toISOString(), // ← ADD THIS LINE
      metadata: {
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0',
        harm_score: Math.floor(Math.random() * 10) + 1
      }
    };

    const { data, error } = await supabase
      .from('threats')
      .insert([randomThreat])
      .select()
      .single();

    if (error) throw error;

    setThreats(prev => [data, ...prev]);
    
    return { success: true, threat: data };
  } catch (error) {
    console.error('Error simulating threat:', error);
    setError(error.message);
    return { success: false, error: error.message };
  }
};

  return {
    threats,
    loading,
    error,
    simulateThreat,
    updateThreatStatus, // MAKE SURE THIS IS INCLUDED
    refetch: fetchThreats,
    clearError: () => setError(null)
  };
}