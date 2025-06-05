'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { User, IdCard, Phone, Stethoscope, CalendarDays } from "lucide-react";
import { ClipboardCopy, FileText } from "lucide-react";

type Paciente = {
  id: string;
  nombre: string;
  dni: string;
  telefono: string;
  cirugia: string;
  fecha: string;
};

export default function PanelMedico() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    cirugia: '',
    fecha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarPaciente = async () => {
    const nuevoPaciente: Paciente = {
        id: uuidv4(),
        ...form,
    };

    setPacientes([...pacientes, nuevoPaciente]);
    setForm({ nombre: '', dni: '', telefono: '', cirugia: '', fecha: '' });

    await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPaciente),
    });
    };


  return (
  <main className="max-w-4xl mx-auto py-10 px-4">
    {/* ENCABEZADO */}
    <div className="flex flex-col items-center justify-center mb-8">
      <img
        src="https://qhmtgwxgjeugnrvopayo.supabase.co/storage/v1/object/public/logos//idly_FP4r7_logos.png"
        alt="Logo Reina Fabiola"
        className="h-20 mb-2 drop-shadow-sm"
      />
      <h1 className="text-2xl md:text-3xl font-bold text-blue-800 flex items-center gap-2">
        Panel médico – Clínica Reina Fabiola
      </h1>
      <p className="text-sm text-gray-500 mt-1">Acceso exclusivo para profesionales</p>
    </div>

    {/* FORMULARIO DE CARGA */}
    <div className="bg-blue-50 shadow-lg border-l-4 border-blue-500 rounded-xl p-8 mb-10">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6">📋 Cargar nuevo paciente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo: Nombre */}
        <div className="relative">
          <User className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
          <input
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full pt-6 p-3 pl-10 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
          />
          <label className="absolute left-10 top-4 text-gray-500 text-sm 
                           transition-all duration-200 ease-in-out
                           peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">
            Nombre
          </label>
        </div>

        {/* Campo: DNI */}
        <div className="relative">
          <IdCard className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
          <input
            name="dni"
            type="text"
            value={form.dni}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full pt-6 p-3 pl-10 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
          />
          <label className="absolute left-10 top-4 text-gray-500 text-sm 
                           transition-all duration-200 ease-in-out
                           peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">
            DNI
          </label>
        </div>

        {/* Campo: Teléfono */}
        <div className="relative">
          <Phone className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
          <input
            name="telefono"
            type="text"
            value={form.telefono}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full pt-6 p-3 pl-10 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
          />
          <label className="absolute left-10 top-4 text-gray-500 text-sm 
                           transition-all duration-200 ease-in-out
                           peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">
            Teléfono
          </label>
        </div>

        {/* Campo: Cirugía */}
        <div className="relative">
          <Stethoscope className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
          <input
            name="cirugia"
            type="text"
            value={form.cirugia}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full pt-6 p-3 pl-10 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
          />
          <label className="absolute left-10 top-4 text-gray-500 text-sm 
                           transition-all duration-200 ease-in-out
                           peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400">
            Cirugía
          </label>
        </div>

        {/* Campo: Fecha (manual, sin selector) */}
        <div className="relative">
        <input
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full pt-6 p-3 pl-3 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                    text-gray-700 [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <label
            htmlFor="fecha"
            className="absolute left-3 top-2 text-sm text-blue-600 font-medium
                    transition-all duration-200 ease-in-out
                    peer-focus:text-blue-600"
        >
            Fecha de cirugía
        </label>
        </div>
    </div>
      {/* BOTÓN */}
      <button
        onClick={agregarPaciente}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition flex items-center gap-2"
      >
        Generar link de seguimiento
      </button>
    </div>
    
    {/* LISTA DE PACIENTES */}
    <div className="bg-white shadow-md rounded-lg p-6 border">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
        <FileText className="w-5 h-5" /> Pacientes generados
    </h2>

    <ul className="space-y-4">
        {pacientes.map((p) => (
        <li
            key={p.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-sm"
        >
            <div>
            <p className="text-base font-semibold text-gray-800">{p.nombre} – {p.cirugia}</p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                {p.fecha} &nbsp; | &nbsp; DNI: {p.dni}
            </p>
            </div>

            <button
            onClick={() =>
                navigator.clipboard.writeText(
                `${window.location.origin}/seguimiento/${p.id}`
                )
            }
            className="mt-3 md:mt-0 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
            >
            <ClipboardCopy className="w-4 h-4" />
            Copiar link
            </button>
        </li>
        ))}
    </ul>
    </div>

  </main>
);
}
