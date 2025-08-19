// app/api/create-student.ts
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('Students')
      .insert([{ email_address: email, created_at: new Date() }])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
