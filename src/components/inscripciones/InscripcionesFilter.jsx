const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const horariosDisponibles = [
    "08:00 - 11:20",
    "13:00 - 16:20",
    "17:00 - 20:20"
];

const carreras = ["Administración",
        "Administración con énfasis en Gestión Financiera",
        "Administración Educativa",
        "Antropología",
        "Archivística",
        "Arte",
        "Bibliotecología",
        "Bibliotecología y Documentación",
        "Biología",
        "Biología Marina",
        "Cartografía",
        "Ciencias Actuariales",
        "Ciencias Agrarias",
        "Ciencias Ambientales",
        "Ciencias de la Educación",
        "Ciencias de la Educación con énfasis en Educación Rural",
        "Ciencias del Deporte",
        "Ciencias Forestales",
        "Ciencias Geográficas",
        "Ciencias Geográficas con énfasis en Ordenamiento Territorial",
        "Ciencias Marinas y Costeras",
        "Ciencias Políticas",
        "Comunicación",
        "Contaduría Pública",
        "Cooperativismo",
        "Danza",
        "Desarrollo Comunitario Sustentable",
        "Desarrollo Humano",
        "Desarrollo Rural",
        "Economía",
        "Educación de Adultos",
        "Educación Especial",
        "Educación Física",
        "Educación Rural",
        "Enfermería",
        "Enseñanza de la Filosofía",
        "Enseñanza de la Música",
        "Enseñanza de las Artes Plásticas",
        "Enseñanza de las Ciencias Naturales",
        "Enseñanza de las Matemáticas",
        "Enseñanza de los Estudios Sociales",
        "Enseñanza del Castellano y Literatura",
        "Enseñanza del Francés",
        "Enseñanza del Inglés",
        "Enseñanza del Inglés para III Ciclo y Educación Diversificada",
        "Estudios Interdisciplinarios",
        "Filosofía",
        "Física",
        "Francés",
        "Gestión Ambiental",
        "Gestión de la Información",
        "Gestión de Recursos Humanos",
        "Gestión de Recursos Naturales",
        "Gestión Empresarial del Turismo Sostenible",
        "Historia",
        "Ingeniería Agronómica",
        "Ingeniería en Biotecnología",
        "Ingeniería en Ciencias Forestales",
        "Ingeniería en Sistemas de Información",
        "Ingeniería Hidrológica",
        "Ingeniería Industrial",
        "Ingeniería Informática",
        "Literatura y Lingüística",
        "Manejo de Recursos Naturales",
        "Matemática",
        "Medicina",
        "Medicina Veterinaria",
        "Meteorología",
        "Música",
        "Nutrición Humana",
        "Orientación",
        "Pedagogía con énfasis en Educación Preescolar",
        "Pedagogía con énfasis en I y II Ciclos",
        "Planificación Económica y Social",
        "Producción Audiovisual",
        "Promoción de la Salud",
        "Psicología",
        "Química",
        "Relaciones Internacionales",
        "Salud Ocupacional",
        "Sociología",
        "Teatro",
        "Tecnología Educativa",
        "Tecnologías de Información",
        "Tecnologías en Salud",
        "Terapia Física",
        "Topografía",
        "Trabajo Social",
        "Traducción Francés-Español",
        "Traducción Inglés-Español",
        "Turismo",
"carrera libre"]

export const InscripcionesFilter = ({ 
    searchTerm, 
    setSearchTerm, 
    filterDia, 
    setFilterDia, 
    filterHorario,
    filterCarrera, 
    setFilterCarrera,
    setFilterHorario 
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Búsqueda */}
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Buscar por nombre del curso, código o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            {/*Filtro por carrere*/}
            <div className="w-full lg:w-48">
                <select
                    value={filterCarrera}
                    onChange={(e) => setFilterCarrera(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todas las carreras</option>
                    {/* Aquí deberías mapear las carreras disponibles */}
                    {carreras.map(carrera => (
                        <option key={carrera} value={carrera}>{carrera}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por día */}
            <div className="w-full lg:w-48">
                <select
                    value={filterDia}
                    onChange={(e) => setFilterDia(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todos los días</option>
                    {diasSemana.map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                    ))}
                </select>
            </div>

            {/* Filtro por horario */}
            <div className="w-full lg:w-48">
                <select
                    value={filterHorario}
                    onChange={(e) => setFilterHorario(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todos los horarios</option>
                    {horariosDisponibles.map(horario => (
                        <option key={horario} value={horario}>{horario}</option>
                    ))}
                </select>
            </div>

            {/* Botón para limpiar filtros */}
            {(searchTerm || filterDia || filterHorario || filterCarrera) && (
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setFilterDia("");
                        setFilterHorario("");
                        setFilterCarrera("");
                    }}
                    className="w-full lg:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
};