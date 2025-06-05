import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const pacientesPath = path.join(process.cwd(), 'public', 'pacientes.json');

  try {
    const pacientes = JSON.parse(fs.readFileSync(pacientesPath, 'utf-8'));

    const nuevoPaciente = {
      id: crypto.randomUUID(),
      ...data,
    };

    pacientes.push(nuevoPaciente);
    fs.writeFileSync(pacientesPath, JSON.stringify(pacientes, null, 2));

    return NextResponse.json({ ok: true, id: nuevoPaciente.id });

  } catch (error) {
    console.error("❌ Error al guardar paciente:", error);
    return NextResponse.json({ ok: false, error: 'No se pudo guardar el paciente' }, { status: 500 });
  }
}
