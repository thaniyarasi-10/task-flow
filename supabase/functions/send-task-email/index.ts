import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, task, sharedBy, message } = await req.json()

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // - Postmark

    // For demonstration, we'll simulate sending emails
    console.log('Sending task sharing email to:', to)
    console.log('Task details:', task)
    console.log('Shared by:', sharedBy)
    console.log('Message:', message)

    // Simulate email sending with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here's how you would integrate with a real email service:
    /*
    const emailData = {
      to: to,
      from: 'noreply@taskspace.com',
      subject: `Task Shared: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">You've been shared a task!</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${sharedBy.name} (${sharedBy.email})</p>
            <p><strong>Task:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            ${task.dueDate ? `<p><strong>Due Date:</strong> ${task.dueDate}</p>` : ''}
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          <p>This task has been shared with you through TaskSpace.</p>
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from TaskSpace. Please do not reply to this email.
          </p>
        </div>
      `
    }

    // Example with SendGrid:
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: to.map(email => ({ email })),
          subject: emailData.subject
        }],
        from: { email: emailData.from },
        content: [{
          type: 'text/html',
          value: emailData.html
        }]
      })
    })
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notifications sent successfully',
        recipients: to.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email notifications',
        details: error.message 
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