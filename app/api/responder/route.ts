// @ts-ignore
const { google } = require('googleapis');
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
 
const SHEET_ID = '1cSWp5jBz2nLSMbWbbontNNODSLGclN8TOVxh-TmV3aY';
const SHEET_NAME = 'Seguimiento';

// @ts-ignore
const credentials = {
  type: "service_account",
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.GCP_PRIVATE_KEY_ID,
  private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.GCP_CLIENT_EMAIL,
  client_id: process.env.GCP_CLIENT_ID,
  auth_uri: process.env.GCP_AUTH_URI,
  token_uri: process.env.GCP_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER,
  client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
};

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Buscar datos del paciente
  const pacientesPath = path.join(process.cwd(), 'data', 'pacientes.json');
  const pacientes = JSON.parse(fs.readFileSync(pacientesPath, 'utf-8'));
  const paciente = pacientes.find((p: any) => p.id === data.pacienteId);

  if (!paciente) {
    return NextResponse.json({ ok: false, error: 'Paciente no encontrado' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          paciente.id,
          paciente.nombre,
          paciente.dni,
          paciente.telefono,
          paciente.cirugia,
          paciente.fecha,
          data.dolor6h,
          data.dolor24h,
          data.dolorMayor7,
          data.nauseas,
          data.vomitos,
          data.somnolencia,
          data.medicacionExtra,
          data.despertoPorDolor,
          data.quiereSeguimiento,
          data.satisfaccion,
          data.observaciones,
          new Date().toLocaleString('es-AR')
        ]]
      }
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('❌ ERROR al guardar en Google Sheets:', err);
    return NextResponse.json({ ok: false, error: 'Error al guardar en Google Sheets' });
  }
}
