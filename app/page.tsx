import Image from "next/image";

export default function Home() {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-900 font-sans">
    <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Seguimiento Postoperatorio</h1>

    <div className="w-full max-w-md space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📌 Opción 1</h2>
        <p className="mb-4">Generar link de seguimiento para paciente.</p>
        <a
          href="/panel-medico"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Ir al panel del médico
        </a>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📄 Opción 2</h2>
        <p className="mb-4">Ver respuestas de seguimiento de un paciente.</p>
        <form action="/seguimiento/abc123" method="GET">
          <input
            type="text"
            name="id"
            placeholder="Ingresá el ID del seguimiento"
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Ver seguimiento
          </button>
        </form>
      </div>
    </div>
  </div>
);
}
