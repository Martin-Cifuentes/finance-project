# Módulo de Gestión de Movimientos Financieros - Fintech MVP

## 1. Resumen General del Proyecto
Este proyecto es un Producto Mínimo Viable (MVP) enfocado en la gestión de finanzas personales. Permite a los usuarios registrar transacciones financieras (Ingresos y Egresos), agruparlas bajo categorías personalizadas y monitorear sus balances. Además, implementa lógica de alertas de presupuestos para notificar de forma proactiva al usuario si sus gastos exceden el 80% o el 100% de la cuota mensual de cada categoría.

## 2. Decisiones de Arquitectura y Stack Tecnológico
Para garantizar robustez, mantenibilidad y escalabilidad, se ha implementado un desacoplamiento completo:
- **Base de Datos**: PostgreSQL running locally on Docker. Implementa borrado lógico (*soft delete*) con soporte UUID. Para la aplicación desplegada se usa Neon.
- **Backend (FastAPI)**: Arquitectura limpia y modular. Hace uso de SQLAlchemy 2.0 y Pydantic V2 para validación estricta de tipos y mapeo ORM. Seguridad robusta con cifrado `bcrypt` directo y generación/firma de tokens JWT. Para la aplicación desplegada se usa Render.
- **Frontend (Next.js)**: Configuración con App Router, estilizada bajo estética oscura premium usando Tailwind CSS. La lógica del estado está completamente centralizada y los componentes UI se modularizaron para simplificar el código. Para la aplicación desplegada se usa Vercel.

## 3. Proceso de Creación del Software y Gestión del Tiempo
Se empleó la metodología **TDD (Test-Driven Development)** en el backend antes de escribir la lógica de negocio, lo que ayudó a mantener una cobertura superior y prever fallas tempranas de autenticación, borrado lógico e inyección de datos. La gestión de tareas se guio estrictamente en fases ágiles desde el diseño del esquema de base de datos hasta la integración del pipeline de CI/CD.

## 4. Documentación del Uso de Inteligencia Artificial

Para realizar este proyecto se utilizó principalmente el modelo gemini 3 pro en la herramienta de chat de google para planeación y Antigravity para el desarrollo del proyecto.

### 4.1. Directrices de Diseño y Criterio Propio
El desarrollo y refactorización guiados por IA se alinearon de manera rigurosa con los archivos de gobernanza del proyecto:
- **RULES.md**: Estableció el rol del agente como desarrollador Fullstack experto enfocado en la seguridad y el código limpio, forzando la implementación de tests antes del desarrollo del negocio.
- **plan.yaml**: Sirvió como hoja de ruta inalterable para ejecutar secuencialmente cada hito, desde el diseño del esquema de base de datos hasta las integraciones de pipelines (PIPE) y despliegue en nube (CLOUD).
- **details.yaml**: Funcionó como el contrato técnico definitivo de aceptación. Cada criterio (CORS restrictivo, cifrado bcrypt, borrado lógico mandatorio filtrando siempre por `user_id`, límites de alertas de presupuesto y avisos visuales mediante Toasts en Next.js) fue verificado minuciosamente antes de dar por cerrada cada tarea.

### 4.2. Ejemplo Concreto de Prompt y Respuesta 1
**Contexto**: Inicio del proyecto tras haber preparado los archivos base.
- **Prompt (Usuario)**: *"Revisa la información de RULES.md para tener contexto de tu metodología de trabajo. Luego realizarás únicamente las siguientes tareas: - phases/phase_2/task/id/"BACK-01" - phases/phase_3/task/id/"FRONT-01" - Después de tener lo base de front y back vas a modificar start.bat para crear un script que ejecute tanto back como front"*
- **Respuesta (IA)**: De acuerdo con el flujo de trabajo establecido, se han completado las tareas `BACK-01` (inicialización modular de `FastAPI`, configuración de CORS y conexión a PostgreSQL mediante `SQLAlchemy`) y `FRONT-01` (creación del proyecto `Next.js` con `Tailwind CSS` y variables de entorno para la comunicación con la API), además de reescribir el script de inicio local `(start.bat)` para levantar automáticamente ambos servicios en simultáneo mediante procesos independientes.

### 4.3. Ejemplo Concreto de Prompt y Respuesta 2
**Contexto**: Se requiere crear archivos .gitignore para cada proyecto.
- **Prompt (Usuario/Sistema)**: *"crea unos gitignore respectivamente para cada proyecto según los archivos que sean necesarios ignorar"*
- **Respuesta (IA)**: De acuerdo con el flujo de trabajo establecido, se han creado los archivos `.gitignore` para los proyectos `backend` y `frontend`, asegurando que los archivos de entorno, caché, dependencias y logs no sean incluidos en el control de versiones.

### 4.4. Justificación Técnica de Sugerencia de IA Rechazada o Modificada
Durante el desarrollo se consideró inicialmente resolver la colisión de nombres de categorías eliminadas borrando físicamente la fila en lugar de hacer borrado lógico. No obstante, esta sugerencia fue **rechazada** debido a que violaba la regla de auditoría de `details.yaml` ("Implementar borrado lógico en BD. No usar DELETE físico"). Se optó por la solución técnica de recuperación/restauración de registros lógicos para mantener el historial intacto.

## 5. Módulos Funcionales Implementados

### 5.1. Módulo 1: Autenticación y Gestión de Sesión
En el backend, se implementó `JWT` para la gestión de sesiones, permitiendo el login, registro y recuperación de contraseñas. En el frontend, se implementó un middleware para la gestión de rutas privadas.

### 5.2. Módulo 2: Registro y Consulta de Movimientos Financieros
Permite al usuario registrar ingresos y egresos, agruparlos bajo categorías personalizadas y monitorear sus balances.

### 5.3. Módulo 3: Categorías y Presupuestos Mensuales con Alertas
Permite al usuario establecer presupuestos mensuales para cada categoría y recibir alertas cuando sus gastos exceden el 80% o el 100% del presupuesto.

## 6. Seguridad y Manejo de Datos Sensibles
Se evita el almacenamiento en plano de contraseñas mediante `bcrypt` y las sesiones se validan a través de JWT firmados localmente por la API. El middleware de Next.js restringe las rutas privadas a nivel cliente.

## 7. Estrategia de Pruebas Automáticas y Cobertura
Suite completa de 20 tests unitarios y de integración desarrollados en `pytest` cubriendo flujos de autenticación, CRUD y reglas complejas de límites de presupuesto.

## 8. Pipeline de CI/CD, Calidad de Código y Vulnerabilidades
Pipeline configurado en GitHub Actions (`.github/workflows/ci.yml`) que:
- Inicia un servicio Postgres local para pruebas automatizadas.
- Compila y valida el tipado y dependencias del Frontend en Next.js.
- Ejecuta SonarCloud para análisis estático de calidad de código.
- Ejecuta Trivy para búsqueda de vulnerabilidades y exploits de dependencias de alta severidad.

## 9. Instrucciones de Despliegue en la Nube y URLs Públicas
- **Frontend (Vercel)**: [finance-project-cwtswt7cr-martin-cifuentes-projects.vercel.app](https://finance-project-cwtswt7cr-martin-cifuentes-projects.vercel.app/)
- **Backend (Render)**: [finance-project-213o.onrender.com](https://finance-project-213o.onrender.com/)

## 10. Guía de Ejecución Local en un Solo Comando
Para facilitar la ejecución de este proyecto completo de forma local, se ha provisto un script unificado de automatización de entornos denominado `init.bat` en la raíz del proyecto.

### Requisitos previos:
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) (debe estar en ejecución).
- Tener instalado [Python 3.12](https://www.python.org/downloads/) y configurado en el PATH.
- Tener instalado [Node.js v20+](https://nodejs.org/).

### Instrucciones de ejecución:
1. Abre tu terminal de Windows (CMD o PowerShell) en la raíz del repositorio.
2. Ejecuta el script con el siguiente comando:
   ```cmd
   .\init.bat
   ```
3. **¿Qué hace el script?**
   - Elimina contenedores previos de bases de datos para evitar conflictos y levanta un nuevo servicio PostgreSQL en el puerto `5434` vía Docker Compose.
   - Crea un entorno virtual Python en `finance-project-back`, instala sus dependencias (`requirements.txt`) y arranca el backend con Uvicorn en `http://localhost:8000`.
   - Instala las dependencias del frontend con `npm install` y levanta el servidor de desarrollo Next.js en `http://localhost:3000`.

## 11. Limitaciones del MVP y Funcionalidades Pendientes
Pese a que el proyecto cuenta con todos los aspectos fundamentales para un MVP, se identifican las siguientes limitaciones:
- No se puede cambiar una categoría con presupuesto a una sin presupuesto.
- No se puede cambiar el valor de un movimiento al editarlo y la fecha cambia automáticamente a la actual.
- La visualización de movimientos no tiene paginado.
- No hay filtro por rango de fechas.