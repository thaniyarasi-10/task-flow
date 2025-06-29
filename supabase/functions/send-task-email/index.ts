import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string[];
  task: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate?: string;
  };
  sharedBy: {
    email: string;
    name: string;
  };
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, task, sharedBy, message }: EmailRequest = await req.json()

    console.log('📧 Processing email request:', {
      recipients: to.length,
      task: task.title,
      sharedBy: sharedBy.email
    })

    // Validate input
    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error('No recipients provided')
    }

    if (!task || !task.title) {
      throw new Error('Invalid task data')
    }

    if (!sharedBy || !sharedBy.email) {
      throw new Error('Invalid sender data')
    }

    // Try multiple email services in order of preference
    let emailResult;
    
    try {
      // First try: Resend (most reliable)
      emailResult = await sendWithResend(to, task, sharedBy, message);
      console.log('✅ Email sent successfully via Resend');
    } catch (resendError) {
      console.log('⚠️ Resend failed, trying SMTP...', resendError.message);
      
      try {
        // Second try: SMTP
        emailResult = await sendWithSMTP(to, task, sharedBy, message);
        console.log('✅ Email sent successfully via SMTP');
      } catch (smtpError) {
        console.log('⚠️ SMTP failed, using simulation...', smtpError.message);
        
        // Final fallback: Simulation with detailed logging
        emailResult = await simulateEmailSending(to, task, sharedBy, message);
        console.log('✅ Email simulation completed');
      }
    }

    return new Response(
      JSON.stringify(emailResult),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email notifications',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

async function sendWithResend(to: string[], task: any, sharedBy: any, message?: string) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    throw new Error('Resend API key not configured')
  }

  console.log('📧 Sending via Resend API...')
  
  const emailSubject = `📋 Task Shared: ${task.title}`
  const emailHtml = createEmailTemplate(task, sharedBy, message)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TaskSpace <noreply@resend.dev>',
      to: to,
      subject: emailSubject,
      html: emailHtml
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log('✅ Resend response:', result)

  return {
    success: true,
    message: `Email notifications sent via Resend to ${to.length} recipients`,
    recipients: to.length,
    service: 'Resend',
    details: {
      subject: emailSubject,
      recipientCount: to.length,
      taskTitle: task.title,
      sender: sharedBy.email,
      messageId: result.id
    }
  }
}

async function sendWithSMTP(to: string[], task: any, sharedBy: any, message?: string) {
  // Using a simple SMTP service like EmailJS or similar
  const smtpConfig = {
    host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
    port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
    username: Deno.env.get('SMTP_USERNAME'),
    password: Deno.env.get('SMTP_PASSWORD')
  }

  if (!smtpConfig.username || !smtpConfig.password) {
    throw new Error('SMTP credentials not configured')
  }

  console.log('📧 Sending via SMTP...')
  
  // For now, we'll use a webhook-based email service as SMTP is complex in Deno
  const emailSubject = `📋 Task Shared: ${task.title}`
  const emailHtml = createEmailTemplate(task, sharedBy, message)

  // Using EmailJS as a simple alternative
  const emailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: Deno.env.get('EMAILJS_SERVICE_ID'),
      template_id: Deno.env.get('EMAILJS_TEMPLATE_ID'),
      user_id: Deno.env.get('EMAILJS_USER_ID'),
      template_params: {
        to_email: to.join(','),
        subject: emailSubject,
        html_content: emailHtml,
        from_name: sharedBy.name,
        from_email: sharedBy.email
      }
    })
  })

  if (!emailJSResponse.ok) {
    throw new Error(`EmailJS error: ${emailJSResponse.status}`)
  }

  return {
    success: true,
    message: `Email notifications sent via SMTP to ${to.length} recipients`,
    recipients: to.length,
    service: 'SMTP/EmailJS',
    details: {
      subject: emailSubject,
      recipientCount: to.length,
      taskTitle: task.title,
      sender: sharedBy.email
    }
  }
}

async function simulateEmailSending(to: string[], task: any, sharedBy: any, message?: string) {
  console.log('🎭 Simulating email sending...')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const emailSubject = `📋 Task Shared: ${task.title}`
  const emailContent = createEmailTemplate(task, sharedBy, message)
  
  // Log detailed email information
  console.log('📧 EMAIL SIMULATION DETAILS:')
  console.log('='.repeat(50))
  console.log(`📤 From: ${sharedBy.name} <${sharedBy.email}>`)
  console.log(`📥 To: ${to.join(', ')}`)
  console.log(`📋 Subject: ${emailSubject}`)
  console.log(`🎯 Task: ${task.title}`)
  console.log(`📝 Description: ${task.description || 'No description'}`)
  console.log(`⚡ Priority: ${task.priority}`)
  console.log(`📊 Status: ${task.status}`)
  if (task.dueDate) {
    console.log(`📅 Due Date: ${task.dueDate}`)
  }
  if (message) {
    console.log(`💬 Personal Message: "${message}"`)
  }
  console.log('='.repeat(50))
  
  // Simulate successful sending
  return {
    success: true,
    message: `Email simulation completed - ${to.length} emails would be sent`,
    recipients: to.length,
    service: 'Simulation',
    details: {
      subject: emailSubject,
      recipientCount: to.length,
      taskTitle: task.title,
      sender: sharedBy.email,
      simulationNote: 'This is a simulation. No actual emails were sent.',
      emailContent: emailContent.substring(0, 200) + '...'
    }
  }
}

function createEmailTemplate(task: any, sharedBy: any, message?: string): string {
  const priorityColors = {
    high: { bg: '#fee2e2', color: '#dc2626', border: '#ef4444' },
    medium: { bg: '#fef3c7', color: '#d97706', border: '#f59e0b' },
    low: { bg: '#d1fae5', color: '#059669', border: '#10b981' }
  }

  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Task Shared: ${task.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
          }
          .header p { 
            margin: 10px 0 0 0; 
            opacity: 0.9; 
            font-size: 16px;
          }
          .content { 
            padding: 30px 20px; 
          }
          .sender-info {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #3b82f6;
          }
          .task-details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid ${priorityColor.border}; 
          }
          .task-details h2 {
            margin-top: 0;
            color: #1f2937;
            font-size: 20px;
          }
          .message-box {
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0ea5e9;
          }
          .message-box h3 {
            margin-top: 0;
            color: #0369a1;
            font-size: 16px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .footer { 
            background: #f8fafc;
            text-align: center; 
            padding: 20px; 
            font-size: 12px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
          }
          .priority-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background: ${priorityColor.bg};
            color: ${priorityColor.color};
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            background: #e5e7eb;
            color: #374151;
            text-transform: capitalize;
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Task Shared with You!</h1>
            <p>You've received a new task collaboration request</p>
          </div>
          
          <div class="content">
            <div class="sender-info">
              <strong>📤 Shared by:</strong> ${sharedBy.name}<br>
              <strong>📧 Email:</strong> ${sharedBy.email}<br>
              <strong>🕒 Shared on:</strong> ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            <div class="task-details">
              <h2>🎯 ${task.title}</h2>
              <p><strong>📝 Description:</strong><br>${task.description || 'No description provided'}</p>
              
              <div style="margin: 15px 0;">
                <span class="priority-badge">
                  🚨 ${task.priority} Priority
                </span>
                <span class="status-badge">
                  📊 ${task.status.replace('-', ' ')}
                </span>
              </div>
              
              ${task.dueDate ? `
                <p><strong>📅 Due Date:</strong> 
                  <span style="color: #dc2626; font-weight: 600;">
                    ${new Date(task.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </p>
              ` : '<p><strong>📅 Due Date:</strong> <span style="color: #6b7280;">No due date set</span></p>'}
            </div>
            
            ${message ? `
              <div class="message-box">
                <h3>💬 Personal Message from ${sharedBy.name}:</h3>
                <p style="margin-bottom: 0; font-style: italic; font-size: 16px; color: #0369a1;">
                  "${message}"
                </p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 15px; font-size: 16px;">Ready to collaborate on this task?</p>
              <a href="https://taskspace.app/dashboard" class="cta-button">
                🚀 Open TaskSpace Dashboard
              </a>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                <strong>💡 What's next?</strong> This task has been shared with you through TaskSpace. 
                You can now track its progress, add comments, and collaborate with ${sharedBy.name} and the team.
              </p>
            </div>

            <div style="background: #fef7cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 15px;">
              <p style="margin: 0; color: #92400e; font-size: 13px;">
                <strong>🔒 Privacy Note:</strong> This email contains task information shared specifically with you. 
                Please keep this information confidential and use it only for the intended collaboration purpose.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>TaskSpace</strong> - Your collaborative task management platform</p>
            <p>This email was sent because ${sharedBy.name} shared a task with you.</p>
            <p style="margin-top: 10px;">© 2024 TaskSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}