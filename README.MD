
# GetChatbot Documentation

## Descripción del Proyecto

**GetChatbot** es una aplicación web que permite a los usuarios crear, entrenar e interactuar con chatbots personalizados. El proyecto está dividido en dos partes principales:

- **Frontend**: Interfaz de usuario desarrollada con React y TailwindCSS.
- **Backend**: API RESTful construida con Django y Django REST Framework.

El objetivo principal es proporcionar una plataforma fácil de usar para crear chatbots basados en texto, documentos o páginas web.

---

## Estructura del Proyecto

```plaintext
getChatbot/
├── backend/       # Backend del proyecto (Django)
│   ├── backend/   # Configuración principal de Django
│   ├── chatbots/  # Gestión de chatbots
│   ├── users/     # Gestión de usuarios
│   ├── db.sqlite3 # Base de datos SQLite
│   └── manage.py  # Script de gestión de Django
├── frontend/      # Frontend del proyecto (React)
│   ├── src/       # Código fuente de React
│   ├── public/    # Archivos públicos
│   ├── package.json # Configuración de dependencias de Node.js
│   └── vite.config.js # Configuración de Vite
└── README.md      # Documentación del proyecto
```

---

## Instalación

### Requisitos Previos

- **Node.js** (para el frontend)
- **Python 3.9+** (para el backend)
- **Django** y **Django REST Framework**
- **SQLite** (base de datos predeterminada)

### Configuración del Backend

1. Navega al directorio `backend`:
    ```bash
    cd getChatbot/backend
    ```
2. Instala las dependencias de Python:
    ```bash
    pip install -r requirements.txt
    ```
3. Configura las migraciones de la base de datos:
    ```bash
    python manage.py migrate
    ```
4. Inicia el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```

### Configuración del Frontend

1. Navega al directorio `frontend`:
    ```bash
    cd getChatbot/frontend
    ```
2. Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
3. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## Funcionalidades Principales

### 1. Gestión de Usuarios
- **Registro de Usuarios**: Los usuarios pueden registrarse proporcionando un correo electrónico y una contraseña. El sistema valida los datos y crea una cuenta única para cada usuario.
- **Inicio de Sesión**: Autenticación mediante JWT (JSON Web Token) para garantizar la seguridad de las sesiones. Los usuarios pueden iniciar sesión con sus credenciales y acceder a sus chatbots personalizados.

### 2. Creación de Chatbots
- **Entrenamiento de Chatbots**:
    - Los usuarios pueden entrenar chatbots utilizando diferentes fuentes de datos:
        - **Texto**: Ingresar texto directamente para entrenar al chatbot.
        - **Documentos PDF**: Subir archivos PDF que el chatbot utilizará como base de conocimiento.
        - **Contenido Web**: Proporcionar URLs de páginas web para extraer información relevante.
- **Personalización**:
    - **Iconos**: Selección de iconos personalizados para representar al chatbot.
    - **Mensajes Iniciales**: Configuración de mensajes de bienvenida que el chatbot mostrará al iniciar una conversación.
    - **Acciones Rápidas**: Creación de botones con respuestas predefinidas para facilitar la interacción.
    - **Temas**: Alternar entre temas claro y oscuro para la interfaz del chatbot.
- **Gestión de Chatbots**: Los usuarios pueden crear múltiples chatbots sin restricciones en la cantidad, cada uno con configuraciones y datos únicos.

### 3. Interacción con Chatbots
- **Mensajería en Tiempo Real**:
    - Los usuarios pueden enviar mensajes al chatbot y recibir respuestas instantáneas basadas en el contexto del documento proporcionado y de la conversacion.
    - Las respuestas del chatbot se generan utilizando el modelo gpt-4 de openAI.
- **Soporte Multilingüe**:
    - Los chatbots pueden interactuar en múltiples idiomas.


### 4. Eliminación de Chatbots

- Los usuarios pueden eliminar chatbots que ya no necesiten.
- Una vez eliminado, el chatbot ya no estará disponible en el listado de chatbots del usuario.
- La interfaz de usuario incluye un botón de eliminación junto a cada chatbot en el listado.

--- 

---

## Estructura del Backend

### Endpoints Principales

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| POST   | `/api/users/register/`                | Registro de usuarios.             |
| POST   | `/api/users/login/`                   | Inicio de sesión.                 |
| GET    | `/api/users/user/`                    | Obtener información del usuario.  |
| POST   | `/api/chatbot/chatbot-train/`         | Entrenar un chatbot.              |
| POST   | `/api/chatbot/chatbot-interact/`      | Interactuar con un chatbot.       |
| GET    | `/api/chatbot/user-chatbots/`         | Listar chatbots del usuario.      |
| GET    | `/api/chatbot/get-specific-chatbot/`  | Obtener detalles de un chatbot.   |
| DELETE | `/api/chatbot/chatbot/<id>/delete/`   | Eliminar un chatbot.              |

---

## Estructura del Frontend

### Componentes Principales

- **Login.jsx**: Página de inicio de sesión.
- **Register.jsx**: Página de registro.
- **Dashboard.jsx**: Panel principal del usuario.
- **Chatbots.jsx**: Listado de chatbots creados por el usuario.
- **NewChatbot.jsx**: Formulario para crear un nuevo chatbot.
- **ChatbotChat.jsx**: Componente para interactuar con un chatbot.

### Configuración de Estilos

El proyecto utiliza **TailwindCSS** para la personalización de estilos. Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  bg: '#222831',
  secondary: '#393E46',
  btn: '#00ADB5',
  txt: '#EEEEEE',
}
```

---

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para proyectos de frontend.
- **TailwindCSS**: Framework de CSS para estilos rápidos y personalizados.

### Backend
- **Django**: Framework web para el desarrollo del backend.
- **Django REST Framework**: Extensión para construir APIs RESTful.
- **SQLite**: Base de datos ligera y fácil de usar.

### Otros
- **OpenAI API**: Para generar embeddings y respuestas del chatbot.
- **Axios**: Cliente HTTP para realizar solicitudes al backend.
