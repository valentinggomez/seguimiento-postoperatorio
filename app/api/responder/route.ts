import { google } from "googleapis";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ Error al parsear JSON:", err);
    return new Response("JSON inválido", { status: 400 });
  }

  const { pacienteId, ...respuestas } = body;

  if (!pacienteId) {
    return new Response("ID de paciente faltante", { status: 400 });
  }

  const { data: paciente, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", pacienteId)
    .single();

  if (error || !paciente) {
    console.error("❌ Paciente no encontrado:", error);
    return new Response("Paciente no encontrado", { status: 404 });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

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

    const sheetId = process.env.SHEET_ID!;
    const sheetName = process.env.SHEET_NAME || "Seguimiento!A1";

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [fila] },
    });

    console.log("✅ Guardado en Google Sheets:", result.statusText);
    return new Response("Guardado correctamente", { status: 200 });

  } catch (err) {
    console.error("❌ Error al guardar en Sheets:", err);
    return new Response("Error al guardar en Sheets", { status: 500 });
  }
}
