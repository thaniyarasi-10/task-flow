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

    console.log('📧 Processing Gmail email request:', {
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

    // Get Gmail API credentials from environment
    const gmailApiKey = Deno.env.get('GMAIL_API_KEY')
    const gmailClientId = Deno.env.get('GMAIL_CLIENT_ID')
    const gmailClientSecret = Deno.env.get('GMAIL_CLIENT_SECRET')
    const gmailRefreshToken = Deno.env.get('GMAIL_REFRESH_TOKEN')

    if (!gmailApiKey || !gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
      console.log('⚠️ Gmail credentials not configured, using fallback email service')
      return await sendWithFallbackService(to, task, sharedBy, message)
    }

    // Get Gmail access token
    const accessToken = await getGmailAccessToken(gmailClientId, gmailClientSecret, gmailRefreshToken)

    // Create email content
    const emailSubject = `📋 Task Shared: ${task.title}`
    const emailHtml = createEmailTemplate(task, sharedBy, message)

    // Send emails via Gmail API
    const results = await Promise.allSettled(
      to.map(recipient => sendGmailEmail(accessToken, recipient, emailSubject, emailHtml, sharedBy))
    )

    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    console.log(`✅ Gmail sending completed: ${successful} successful, ${failed} failed`)

    if (failed > 0) {
      console.warn('⚠️ Some emails failed to send:', 
        results
          .filter(result => result.status === 'rejected')
          .map(result => (result as PromiseRejectedResult).reason)
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email notifications sent via Gmail: ${successful}/${to.length} successful`,
        recipients: successful,
        failed: failed,
        details: {
          subject: emailSubject,
          totalRecipients: to.length,
          successfulSends: successful,
          failedSends: failed,
          taskTitle: task.title,
          sender: sharedBy.email,
          service: 'Gmail API'
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in Gmail email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email notifications via Gmail',
        details: error.message,
        timestamp: new Date().toISOString(),
        service: 'Gmail API'
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

async function getGmailAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  console.log('🔑 Getting Gmail access token...')
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to get Gmail access token: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  console.log('✅ Gmail access token obtained')
  return data.access_token
}

async function sendGmailEmail(
  accessToken: string, 
  to: string, 
  subject: string, 
  htmlContent: string, 
  sharedBy: { email: string; name: string }
): Promise<void> {
  console.log(`📤 Sending Gmail email to: ${to}`)

  // Create the email message in RFC 2822 format
  const emailMessage = [
    `To: ${to}`,
    `From: ${sharedBy.name} <${sharedBy.email}>`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlContent
  ].join('\r\n')

  // Encode the message in base64url format
  const encodedMessage = btoa(emailMessage)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage
    })
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Gmail API error for ${to}: ${response.status} - ${errorData}`)
  }

  const result = await response.json()
  console.log(`✅ Email sent successfully to ${to}, message ID: ${result.id}`)
}

async function sendWithFallbackService(
  to: string[], 
  task: any, 
  sharedBy: any, 
  message?: string
): Promise<Response> {
  console.log('📧 Using fallback email service (Resend)...')
  
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    console.log('⚠️ No email service configured, simulating email send...')
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email simulation completed (no email service configured)',
        recipients: to.length,
        details: {
          subject: `📋 Task Shared: ${task.title}`,
          recipientCount: to.length,
          taskTitle: task.title,
          sender: sharedBy.email,
          service: 'Simulation'
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }

  // Use Resend as fallback
  const emailSubject = `📋 Task Shared: ${task.title}`
  const emailHtml = createEmailTemplate(task, sharedBy, message)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TaskSpace <noreply@taskspace.app>',
      to: to,
      subject: emailSubject,
      html: emailHtml
    })
  })

  if (!resendResponse.ok) {
    throw new Error(`Resend API error: ${resendResponse.status}`)
  }

  console.log('✅ Fallback email sent via Resend')

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Email notifications sent via Resend (fallback)',
      recipients: to.length,
      details: {
        subject: emailSubject,
        recipientCount: to.length,
        taskTitle: task.title,
        sender: sharedBy.email,
        service: 'Resend (Fallback)'
      }
    }),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}

function createEmailTemplate(task: any, sharedBy: any, message?: string): string {
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
            border-left: 4px solid #3b82f6; 
          }
          .task-details h2 {
            margin-top: 0;
            color: #1f2937;
            font-size: 20px;
          }
          .priority-high { border-left-color: #ef4444; }
          .priority-medium { border-left-color: #f59e0b; }
          .priority-low { border-left-color: #10b981; }
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
          .cta-button:hover {
            transform: translateY(-1px);
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
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .priority-high-badge { background: #fee2e2; color: #dc2626; }
          .priority-medium-badge { background: #fef3c7; color: #d97706; }
          .priority-low-badge { background: #d1fae5; color: #059669; }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            background: #e5e7eb;
            color: #374151;
            text-transform: capitalize;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Task Shared!</h1>
            <p>You've received a new task collaboration request</p>
          </div>
          
          <div class="content">
            <div class="sender-info">
              <strong>📤 Shared by:</strong> ${sharedBy.name}<br>
              <strong>📧 Email:</strong> ${sharedBy.email}
            </div>
            
            <div class="task-details priority-${task.priority}">
              <h2>🎯 ${task.title}</h2>
              <p><strong>📝 Description:</strong><br>${task.description || 'No description provided'}</p>
              
              <div style="margin: 15px 0;">
                <span class="priority-badge priority-${task.priority}-badge">
                  ${task.priority} Priority
                </span>
                <span class="status-badge" style="margin-left: 10px;">
                  ${task.status.replace('-', ' ')}
                </span>
              </div>
              
              ${task.dueDate ? `<p><strong>📅 Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>` : '<p><strong>📅 Due Date:</strong> No due date set</p>'}
            </div>
            
            ${message ? `
              <div class="message-box">
                <h3>💬 Personal Message from ${sharedBy.name}:</h3>
                <p style="margin-bottom: 0; font-style: italic; font-size: 16px;">"${message}"</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 15px;">Ready to collaborate on this task?</p>
              <a href="https://taskspace.app/dashboard" class="cta-button">
                🚀 Open TaskSpace Dashboard
              </a>
            </div>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
              <p style="margin: 0; color: #166534;">
                <strong>💡 What's next?</strong> This task has been shared with you through TaskSpace. 
                You can now track its progress, add comments, and collaborate with the team.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>TaskSpace</strong> - Your collaborative task management platform</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p style="margin-top: 10px;">© 2024 TaskSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}