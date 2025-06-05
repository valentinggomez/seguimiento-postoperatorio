import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID faltante' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'No encontrado' }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request: Request) {
  const paciente = await request.json();

  const { data, error } = await supabase
    .from('pacientes')
    .insert([paciente]);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al guardar paciente' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}
