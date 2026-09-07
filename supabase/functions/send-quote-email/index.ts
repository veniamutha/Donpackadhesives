import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const body = await req.json();

    // Supabase sends the new row data under `record`
    const record = body.record;

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in payload' }), { status: 400 });
    }

    const { full_name, company_name, phone, message, created_at } = record;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0a2540; padding: 20px 30px;">
          <h2 style="color: #4ade80; margin: 0;">New Quote Request</h2>
          <p style="color: #94a3b8; margin: 4px 0 0;">DonPack Adhesive — donpack.in</p>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 140px;">Full Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${full_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${company_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">
                <a href="tel:${phone}" style="color: #0a2540;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Received At</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${new Date(created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">Requirement Details</p>
            <div style="background: #f8fafc; border-left: 3px solid #4ade80; padding: 16px; border-radius: 4px; color: #1e293b; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://wa.me/919787465677?text=Hi, I'm responding to the quote request from ${encodeURIComponent(full_name)}" 
               style="background: #25d366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reply via WhatsApp
            </a>
          </div>
        </div>
        <div style="background: #f8fafc; padding: 16px 30px; text-align: center; font-size: 12px; color: #94a3b8;">
          This is an automated notification from your DonPack Adhesive website.
        </div>
      </div>
    `;

    // Call Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DonPack Quotes <onboarding@resend.dev>',
        to: ['sales@donpack.in'],
        subject: `New Quote Request from ${full_name} — ${company_name}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return new Response(JSON.stringify({ error: resendData }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
})
