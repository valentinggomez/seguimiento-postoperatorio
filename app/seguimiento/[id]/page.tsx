'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SeguimientoPaciente() {
  const { id } = useParams();
  const [enviado, setEnviado] = useState(false);
  const [paciente, setPaciente] = useState<any>(null);

  const [form, setForm] = useState({
    dolor6h: '',
    dolor24h: '',
    dolorMayor7: '',
    nauseas: '',
    vomitos: '',
    somnolencia: '',
    medicacionExtra: '',
    despertoPorDolor: '',
    quiereSeguimiento: '',
    satisfaccion: '',
    observaciones: '',
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`/api/pacientes?id=${id}`);
        const data = await res.json();
        setPaciente(data);
      } catch (error) {
        console.error("Error al cargar el paciente:", error);
      }
    };
    fetchPaciente();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pacienteId: id }),
      });
      setEnviado(true);
    } catch (err) {
      alert('Error al enviar los datos');
    }
  };

  if (enviado) {
    return (
      <main className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Respuesta registrada</h1>
        <p className="text-gray-700">Gracias por completar el seguimiento. ¡Que te mejores!</p>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-blue-200">
      <div className="flex flex-col items-center mb-6">
        <img
          src="https://qhmtgwxgjeugnrvopayo.supabase.co/storage/v1/object/public/logos//idly_FP4r7_logos.png"
          alt="Logo Clínica Reina Fabiola"
          className="h-20 mb-2"
        />
        <h1 className="text-2xl font-bold text-blue-800 text-center">Seguimiento Postoperatorio</h1>
        <p className="text-sm text-gray-600 text-center">Clínica Reina Fabiola</p>
      </div>

      {/* Info paciente */}
      {paciente && (
        <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg text-sm text-gray-800 mb-6 border border-blue-100">
          <div><strong>👤 Nombre:</strong> {paciente.nombre}</div>
          <div><strong> DNI:</strong> {paciente.dni}</div>
          <div><strong>🏥 Cirugía:</strong> {paciente.cirugia}</div>
          <div><strong>📅 Fecha:</strong> {paciente.fecha}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campos de dolor */}
        {[{ label: 'Dolor a las 6 horas (0 a 10)', name: 'dolor6h' }, { label: 'Dolor a las 24 horas (0 a 10)', name: 'dolor24h' }].map(({ label, name }) => (
          <label key={name} className="block font-medium text-gray-700">
            {label}
            <input
              type="number"
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              min={0}
              max={10}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        ))}

        {/* Selects */}
        {[
          { name: 'dolorMayor7', label: '¿Tuviste episodios con dolor mayor a 7?' },
          { name: 'nauseas', label: '¿Tuviste náuseas?' },
          { name: 'vomitos', label: '¿Tuviste vómitos?' },
          { name: 'somnolencia', label: '¿Tuviste somnolencia?' },
          { name: 'medicacionExtra', label: '¿Requiriste medicación adicional?' },
          { name: 'despertoPorDolor', label: '¿Te despertaste por dolor durante la noche?' },
          { name: 'quiereSeguimiento', label: '¿Querés recibir seguimiento adicional?' },
        ].map(({ name, label }) => (
          <label key={name} className="block font-medium text-gray-700">
            {label}
            <select
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </label>
        ))}

        {/* Satisfacción */}
        <label className="block font-medium text-gray-700">
          ¿Qué tan satisfecho/a estás con el manejo del dolor? (1 = Muy mal, 5 = Excelente)
          <select
            name="satisfaccion"
            value={form.satisfaccion}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccionar</option>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        {/* Observaciones */}
        <label className="block font-medium text-gray-700">
          Observaciones (opcional)
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Botón enviar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          Enviar seguimiento
        </button>
      </form>
    </div>
  </main>
);
}
