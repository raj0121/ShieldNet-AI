import { useState } from 'react';

export function useEmailService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (to, subject, html) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📧 Attempting to send email to:', to);
      
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          to, 
          subject, 
          html,
          replyTo: 'vag.raj947@gmail.com' // So you can reply to notifications
        }),
      });

      const data = await response.json();
      console.log('📨 Email response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setLoading(false);
      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Send notification to YOUR email (vag.raj947@gmail.com)
  const sendThreatNotificationToAdmin = async (threat, userEmail = '') => {
    const subject = `🚨 [ADMIN] New ${threat.severity.toUpperCase()} Threat: ${threat.threat_type}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">🛡️ ShieldNet AI - Admin Alert</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>New Threat Detected</h3>
          <p><strong>Type:</strong> ${threat.threat_type}</p>
          <p><strong>Severity:</strong> <span style="color: ${getSeverityColor(threat.severity)}; font-weight: bold;">${threat.severity.toUpperCase()}</span></p>
          <p><strong>Description:</strong> ${threat.description}</p>
          <p><strong>User:</strong> ${userEmail || 'Unknown'}</p>
          <p><strong>Detected:</strong> ${new Date(threat.detected_at).toLocaleString()}</p>
        </div>

        <p>This is an automated notification from ShieldNet AI monitoring system.</p>
      </div>
    `;

    // Send to YOUR email address
    return await sendEmail('vag.raj947@gmail.com', subject, html);
  };

  // Send notification to the user who generated the threat
  const sendThreatNotificationToUser = async (userEmail, userName, threat) => {
    const subject = `🚨 Security Alert: ${threat.severity.toUpperCase()} Threat - ${threat.threat_type}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">🛡️ ShieldNet AI Security Alert</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${getSeverityColor(threat.severity)};">
          <h3 style="margin-top: 0; color: ${getSeverityColor(threat.severity)};">${threat.threat_type}</h3>
          <p><strong>Severity:</strong> ${threat.severity.toUpperCase()}</p>
          <p><strong>Description:</strong> ${threat.description}</p>
          <p><strong>Detected:</strong> ${new Date(threat.detected_at).toLocaleString()}</p>
        </div>

        <p>Please review this threat in your security dashboard.</p>
        <p>This is an automated security alert from ShieldNet AI.</p>
      </div>
    `;

    return await sendEmail(userEmail, subject, html);
  };

  return {
    loading,
    error,
    sendEmail,
    sendThreatNotificationToAdmin,
    sendThreatNotificationToUser,
    clearError: () => setError(null),
  };
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#eab308';
    case 'low': return '#22c55e';
    default: return '#64748b';
  }
}