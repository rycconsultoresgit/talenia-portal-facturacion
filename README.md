# Talenia Web

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

Aplicación web frontend para la plataforma Talenia, construida con Next.js y React.

## 🚀 Características

- Interfaz de usuario moderna y responsiva
- Autenticación y gestión de usuarios
- Panel de administración
- Gestión de currículums y perfiles
- Integración con servicios backend de Talenia

## 🛠️ Requisitos previos

- Node.js 22.x
- npm (incluido con Node.js)
- Variables de entorno configuradas (ver `.env.local`)

## 📦 Dependencias principales

- `next` 15.5.2
- `react` 19.1.1
- `react-dom` 19.1.1
- `@heroui/react` 2.7.8
- `axios` 1.11.0
- `framer-motion` 12.23.12
- `jsonwebtoken` 9.0.2
- `sonner` 2.0.7
- `tailwindcss` 3.4.17 (dev)
- `typescript` 5 (dev)
- `eslint` ^9.34.0 (dev)
- `prettier` ^3.6.2 (dev)

## 🚀 Instalación

```bash
npm install
```

## 🏃 Ejecución y desarrollo

```bash
# Desarrollo (puerto 9300)
npm run dev

# Build y producción (puerto 9300)
npm run build
npm start

# Linter y formato
npm run lint
npm run format

#PM2
pm2 start npm --name "talenia-web:9300" -- start
```

Abrir http://localhost:9300 en el navegador.

## 🏗️ Estructura del proyecto

```
app/
├── api/
├── components/
├── styles/
└── ...
public/
.env.local (no versionado)
```

## 🔧 Variables de entorno

- `NEXT_PUBLIC_API_URL`: URL base del backend (por defecto, si no se define: `http://localhost:3030/api/v1`)
- `NEXT_PUBLIC_CV_PROCESS_URL`: URL del servicio de procesamiento de CVs

## 📄 Licencia

UNLICENSED (uso interno). Actualiza aquí si corresponde.
