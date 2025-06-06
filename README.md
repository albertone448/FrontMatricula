# Sistema de Matrícula Universitario

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
<<<<<<< HEAD
![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge&logo=recharts&logoColor=white)
=======
>>>>>>> 92a28d5721ddeeb3371140cf38306d4ffa58eade
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

Interfaz de usuario para un sistema de gestión de matrículas universitarias, permitiendo a estudiantes, profesores y administradores interactuar con la plataforma.

![Screenshot 1](./public/screenshot-for-readme-1.png)
![Screenshot 2](./public/screenshot-for-readme-2.png)
![Screenshot 3](./public/screenshot-for-readme-3.png)

## ✨ Características Principales

-   **Gestión de Perfiles:** Visualización y actualización de información personal para todos los roles.
-   **Inscripción de Materias:** Funcionalidad completa para que los estudiantes seleccionen y gestionen sus materias inscritas, incluyendo validaciones de créditos, horarios y requisitos de carrera.
-   **Visualización de Horarios:** Muestra de horarios detallados para estudiantes y profesores.
-   **Gestión de Cursos y Secciones:** (Para Administradores) Creación, edición y asignación de cursos y secciones.
-   **Gestión de Usuarios:** (Para Administradores) Administración de cuentas de estudiantes, profesores y otros roles.
-   **Paneles Personalizados:** Vistas de inicio adaptadas al rol del usuario (Estudiante, Profesor, Administrador) con estadísticas relevantes.
-   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.
-   **Notificaciones y Alertas:** Mensajes interactivos para el usuario sobre el estado de sus acciones.

## 🛠️ Tecnologías Utilizadas
<<<<<<< HEAD

-   **React (v18.3.1):** Biblioteca principal para la construcción de la interfaz de usuario.
-   **Vite (v5.3.4):** Herramienta de desarrollo frontend para un inicio rápido y HMR (Hot Module Replacement).
-   **Tailwind CSS (v3.4.7):** Framework CSS para un diseño rápido y personalizable.
-   **React Router DOM (v6.25.1):** Para la gestión de rutas en la aplicación.
-   **Recharts (v2.12.7):** Para la creación de gráficos y visualizaciones de datos.
-   **Framer Motion (v11.3.19):** Para animaciones fluidas y atractivas.
-   **Lucide React (v0.417.0):** Colección de iconos SVG.
-   **Axios (v1.9.0):** Cliente HTTP para realizar peticiones a la API.
-   **ESLint (v8.57.0):** Para el linting del código JavaScript/JSX.

## 📋 Prerrequisitos

-   Node.js (v18.x o superior recomendado)
-   npm (v9.x o superior recomendado) o yarn

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```shell
    git clone <URL_DEL_REPOSITORIO>
    cd FrontMatricula
    ```

2.  **Instalar dependencias:**
    ```shell
    npm install
    ```
    o si usas yarn:
    ```shell
    yarn install
    ```

3.  **Configurar la URL de la API:**
    Asegúrate de que el archivo `src/services/apiConfig.js` apunte al backend correcto.
    ```javascript
    // src/services/apiConfig.js
    import axios from 'axios';

    const api = axios.create({
        baseURL: 'http://localhost:TU_PUERTO_DE_BACKEND/api' // Ajusta esta URL
    });

    export default api;
    ```

4.  **Ejecutar la aplicación en modo desarrollo:**
    ```shell
    npm run dev
    ```
    o
    ```shell
    yarn dev
    ```
    Esto iniciará la aplicación en `http://localhost:5173` (o el puerto que Vite asigne).

5.  **Para construir la aplicación para producción:**
    ```shell
    npm run build
    ```
    o
    ```shell
    yarn build
    ```
    Los archivos optimizados se generarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto (Simplificada)

```
FrontMatricula/
├── public/                     # Archivos estáticos (imágenes, etc.)
├── src/
│   ├── assets/                 # (Si se usa para imágenes importadas directamente)
│   ├── components/             # Componentes reutilizables de la UI
│   │   ├── common/             # Componentes comunes (Header, Sidebar, etc.)
│   │   ├── cursos/             # Componentes específicos para Cursos
│   │   ├── horarios/           # Componentes específicos para Horarios
│   │   ├── inicio/             # Componentes para la página de Inicio/Dashboard
│   │   ├── inscripciones/      # Componentes para la Inscripción de Materias
│   │   ├── perfil/             # Componentes para la página de Perfil
│   ├── constants/              # Constantes de la aplicación
│   ├── contexts/               # Contextos de React (ej. UserRoleContext)
│   ├── hooks/                  # Hooks personalizados (ej. useInscripciones, useProfile)
│   ├── pages/                  # Componentes de página (vistas principales)
│   │   └── auth/               # Páginas de autenticación (Login, etc.)
│   ├── services/               # Lógica de comunicación con la API (apiConfig.js)
│   ├── utils/                  # Funciones de utilidad (authUtils.js)
│   ├── App.jsx                 # Componente raíz de la aplicación
│   ├── index.css               # Estilos globales (principalmente Tailwind)
│   └── main.jsx                # Punto de entrada de la aplicación
├── .eslintrc.cjs               # Configuración de ESLint
├── index.html                  # Plantilla HTML principal
├── package.json                # Metadatos del proyecto y dependencias
├── postcss.config.js           # Configuración de PostCSS (para Tailwind)
├── README.md                   # Este archivo
├── tailwind.config.js          # Configuración de Tailwind CSS
└── vite.config.js              # Configuración de Vite
```






=======

-   **React (v18.3.1):** Biblioteca principal para la construcción de la interfaz de usuario.
-   **Vite (v5.3.4):** Herramienta de desarrollo frontend para un inicio rápido y HMR (Hot Module Replacement).
-   **Tailwind CSS (v3.4.7):** Framework CSS para un diseño rápido y personalizable.
-   **React Router DOM (v6.25.1):** Para la gestión de rutas en la aplicación.
-   **Framer Motion (v11.3.19):** Para animaciones fluidas y atractivas.
-   **Lucide React (v0.417.0):** Colección de iconos SVG.
-   **Axios (v1.9.0):** Cliente HTTP para realizar peticiones a la API.
-   **ESLint (v8.57.0):** Para el linting del código JavaScript/JSX.

## 📋 Prerrequisitos

-   Node.js (v18.x o superior recomendado)
-   npm (v9.x o superior recomendado) o yarn

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```shell
    git clone <URL_DEL_REPOSITORIO>
    cd FrontMatricula
    ```

2.  **Instalar dependencias:**
    ```shell
    npm install
    ```
    o si usas yarn:
    ```shell
    yarn install
    ```

3.  **Configurar la URL de la API:**
    Asegúrate de que el archivo `src/services/apiConfig.js` apunte al backend correcto.
    ```javascript
    // src/services/apiConfig.js
    import axios from 'axios';

    const api = axios.create({
        baseURL: 'http://localhost:TU_PUERTO_DE_BACKEND/api' // Ajusta esta URL
    });

    export default api;
    ```

4.  **Ejecutar la aplicación en modo desarrollo:**
    ```shell
    npm run dev
    ```
    o
    ```shell
    yarn dev
    ```
    Esto iniciará la aplicación en `http://localhost:5173` (o el puerto que Vite asigne).

5.  **Para construir la aplicación para producción:**
    ```shell
    npm run build
    ```
    o
    ```shell
    yarn build
    ```
    Los archivos optimizados se generarán en la carpeta `dist/`.

## 📁 Estructura del Proyecto (Simplificada)

```
FrontMatricula/
├── public/                     # Archivos estáticos (imágenes, etc.)
├── src/
│   ├── assets/                 # (Si se usa para imágenes importadas directamente)
│   ├── components/             # Componentes reutilizables de la UI
│   │   ├── common/             # Componentes comunes (Header, Sidebar, etc.)
│   │   ├── cursos/             # Componentes específicos para Cursos
│   │   ├── horarios/           # Componentes específicos para Horarios
│   │   ├── inicio/             # Componentes para la página de Inicio/Dashboard
│   │   ├── inscripciones/      # Componentes para la Inscripción de Materias
│   │   ├── perfil/             # Componentes para la página de Perfil
│   ├── constants/              # Constantes de la aplicación
│   ├── contexts/               # Contextos de React (ej. UserRoleContext)
│   ├── hooks/                  # Hooks personalizados (ej. useInscripciones, useProfile)
│   ├── pages/                  # Componentes de página (vistas principales)
│   │   └── auth/               # Páginas de autenticación (Login, etc.)
│   ├── services/               # Lógica de comunicación con la API (apiConfig.js)
│   ├── utils/                  # Funciones de utilidad (authUtils.js)
│   ├── App.jsx                 # Componente raíz de la aplicación
│   ├── index.css               # Estilos globales (principalmente Tailwind)
│   └── main.jsx                # Punto de entrada de la aplicación
├── .eslintrc.cjs               # Configuración de ESLint
├── index.html                  # Plantilla HTML principal
├── package.json                # Metadatos del proyecto y dependencias
├── postcss.config.js           # Configuración de PostCSS (para Tailwind)
├── README.md                   # Este archivo
├── tailwind.config.js          # Configuración de Tailwind CSS
└── vite.config.js              # Configuración de Vite
```
>>>>>>> 92a28d5721ddeeb3371140cf38306d4ffa58eade
