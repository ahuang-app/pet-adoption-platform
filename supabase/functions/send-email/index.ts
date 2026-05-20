import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name, phone, message, petName } = await req.json()

  const emailBody = `
新领养申请通知：

申请人：${name}
联系电话：${phone}
申请宠物：${petName}
留言：${message || '无'}

请及时处理。
  `.trim()

  // Send via Resend email API
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: '宠物领养平台 <onboarding@resend.dev>',
      to: '2149620045@qq.com',
      subject: `【领养申请】${name} 想领养 ${petName}`,
      text: emailBody,
    }),
  })

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } })
})
