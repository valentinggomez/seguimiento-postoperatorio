import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'pacientes.json');

export async function POST(req: NextRequest) {
  const nuevoPaciente = await req.json();

  const pacientesExistentes = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : [];

  pacientesExistentes.push(nuevoPaciente);

  fs.writeFileSync(filePath, JSON.stringify(pacientesExistentes, null, 2));

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(null);
  }

  const filePath = path.join(process.cwd(), 'data', 'pacientes.json');
  const pacientes = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : [];

  const paciente = pacientes.find((p: any) => p.id === id);

  return NextResponse.json(paciente || null);
}
