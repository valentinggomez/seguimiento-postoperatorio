import { google } from "googleapis";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    let body;
      try {
        body = await req.json();
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      return new Response("JSON inválido o vacío", { status: 400 });
    }
    if (!body || typeof body !== 'object') {
      return new Response("Cuerpo vacío o inválido", { status: 400 });
    }

    const { pacienteId, ...respuestas } = body;

    // ✅ 1. Buscar paciente desde Supabase
    const { data: paciente, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', pacienteId)
      .single();

    if (error || !paciente) {
      console.error("Paciente no encontrado:", error);
      return new Response("Paciente no encontrado", { status: 404 });
    }

    // ✅ 2. Autenticarse con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // ✅ 3. Armar fila con datos del paciente + respuestas
    const fila = [
      new Date().toLocaleString("es-AR"),
      paciente.id,
      paciente.nombre,
      paciente.dni,
      paciente.telefono,
      paciente.cirugia,
      paciente.fecha,
      respuestas.dolor6h,
      respuestas.dolor24h,
      respuestas.dolorMayor7,
      respuestas.nauseas,
      respuestas.vomitos,
      respuestas.somnolencia,
      respuestas.medicacionExtra,
      respuestas.despertoPorDolor,
      respuestas.quiereSeguimiento,
      respuestas.satisfaccion,
      respuestas.observaciones,
    ];

    // ✅ 4. Insertar fila en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: process.env.SHEET_NAME || "Respuestas!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [fila] },
    });

    return new Response("Guardado correctamente", { status: 200 });
  } catch (err) {
    console.error("Error al procesar la respuesta:", err);
    return new Response("Error al guardar", { status: 500 });
  }
}
