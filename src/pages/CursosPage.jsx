import { useEffect, useState } from "react";
import Header from "../components/common/Header";

const CursosPage = () => {
	const [restaurantes, setRestaurantes] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRestaurantes = async () => {
			try {
				const response = await fetch("https://localhost:44316/api/restaurante/obtener_restaurantes_aprobados", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				});

				if (!response.ok) {
					throw new Error("Error al consumir la API");
				}

				const data = await response.json();

				if (data.Resultado) {
					setRestaurantes(data.Restaurantes);
				} else {
					setError("La API respondió con un error");
				}
			} catch (err) {
				console.error(err);
				setError("No se pudo conectar con la API");
			}
		};

		fetchRestaurantes();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Cursos' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{error && <p className='text-red-500'>{error}</p>}

				{restaurantes.length === 0 && !error && <p>Cargando restaurantes...</p>}

				<ul className='space-y-4'>
					{restaurantes.map((r) => (
						<li key={r.RestauranteId} className='p-4 border rounded shadow'>
							<h2 className='text-xl font-semibold'>{r.Nombre}</h2>
							<p className='text-gray-700'>{r.Direccion}</p>
							<p className='text-sm text-gray-500'>ID Usuario: {r.UsuarioId}</p>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
};

export default CursosPage;
