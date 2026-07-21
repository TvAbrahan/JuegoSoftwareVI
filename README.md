# Aventura Kids

Aplicación móvil educativa para niños, desarrollada con React Native y Expo. Incluye minijuegos relacionados con vehículos que ayudan a practicar memoria, lógica, colores, conteo y seguridad vial.

## Características

- Seis minijuegos educativos: rescate, memoria, carrera, pintura, conteo y patrones.
- Tres niveles de dificultad por actividad.
- Sonidos, animaciones y una interfaz colorida.
- Registro local del progreso y los mejores resultados.
- Compatible con Android, iOS y web mediante Expo.

## Tecnologías

- React Native
- Expo SDK 54
- React Navigation
- React Native Reanimated
- Expo Audio
- Expo SQLite

## Requisitos

- [Node.js](https://nodejs.org/)
- npm
- Expo Go en un dispositivo móvil, o un emulador de Android/iOS

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/TvAbrahan/JuegoSoftwareVI.git
   cd JuegoSoftwareVI
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el proyecto:

   ```bash
   npm start
   ```

Escanea el código QR con Expo Go o selecciona una de las opciones disponibles en la terminal.

## Comandos disponibles

```bash
npm start       # Inicia Expo
npm run android # Abre la aplicación en Android
npm run ios     # Abre la aplicación en iOS
npm run web     # Abre la versión web
```

## Estructura principal

```text
Pantallas/     Pantallas y minijuegos
components/    Componentes reutilizables
hooks/         Lógica de sonidos
navigation/    Navegación de la aplicación
utils/         Progreso y reproducción de audio
assets/        Imágenes y sonidos
```

## Autor

Proyecto académico desarrollado como una experiencia educativa e interactiva para niños.
