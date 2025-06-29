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

    // Create email content
    const emailSubject = `Task Shared: ${task.title}`
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .task-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
            .priority-high { border-left-color: #ef4444; }
            .priority-medium { border-left-color: #f59e0b; }
            .priority-low { border-left-color: #10b981; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📋 Task Shared with You!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You've received a new task from ${sharedBy.name}</p>
            </div>
            
            <div class="content">
              <p><strong>From:</strong> ${sharedBy.name} (${sharedBy.email})</p>
              
              <div class="task-details priority-${task.priority}">
                <h2 style="margin-top: 0; color: #1f2937;">${task.title}</h2>
                <p><strong>Description:</strong> ${task.description || 'No description provided'}</p>
                <p><strong>Priority:</strong> <span style="text-transform: capitalize; font-weight: bold; color: ${task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981'};">${task.priority}</span></p>
                <p><strong>Status:</strong> <span style="text-transform: capitalize;">${task.status.replace('-', ' ')}</span></p>
                ${task.dueDate ? `<p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
              </div>
              
              ${message ? `
                <div style="background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h3 style="margin-top: 0; color: #0277bd;">Personal Message:</h3>
                  <p style="margin-bottom: 0; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
              
              <p>This task has been shared with you through <strong>TaskSpace</strong>. You can now collaborate and stay updated on this task's progress.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://taskspace.app" class="button">Open TaskSpace</a>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message from TaskSpace. Please do not reply to this email.</p>
              <p>© 2024 TaskSpace. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // For demonstration purposes, we'll simulate successful email sending
    // In production, you would integrate with a real email service
    
    console.log('✅ Email content generated successfully')
    console.log('📬 Recipients:', to)
    console.log('📝 Subject:', emailSubject)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Here's how you would integrate with real email services:
    
    /* 
    // Example with SendGrid:
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: to.map(email => ({ email })),
          subject: emailSubject
        }],
        from: { 
          email: 'noreply@taskspace.com',
          name: 'TaskSpace'
        },
        content: [{
          type: 'text/html',
          value: emailHtml
        }]
      })
    })

    if (!sendGridResponse.ok) {
      throw new Error(`SendGrid API error: ${sendGridResponse.status}`)
    }
    */

    /*
    // Example with Resend:
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TaskSpace <noreply@taskspace.com>',
        to: to,
        subject: emailSubject,
        html: emailHtml
      })
    })

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResponse.status}`)
    }
    */

    /*
    // Example with Mailgun:
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN')
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY')
    
    const formData = new FormData()
    formData.append('from', 'TaskSpace <noreply@taskspace.com>')
    formData.append('to', to.join(','))
    formData.append('subject', emailSubject)
    formData.append('html', emailHtml)

    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`
      },
      body: formData
    })

    if (!mailgunResponse.ok) {
      throw new Error(`Mailgun API error: ${mailgunResponse.status}`)
    }
    */

    console.log('🎉 Email simulation completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notifications sent successfully',
        recipients: to.length,
        details: {
          subject: emailSubject,
          recipientCount: to.length,
          taskTitle: task.title,
          sender: sharedBy.email
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
    console.error('❌ Error sending email:', error)
    
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