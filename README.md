# Home Finance Copilot

Asistente financiero personal basado en **Next.js + Airtable + Make + OpenAI**.

## Arquitectura recomendada

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** API Routes de Next.js (`app/api/*`)
- **Base de datos:** Airtable
- **Automatización:** Make
- **IA:** API de OpenAI

## Flujo lógico

1. El usuario interactúa con el frontend (registro y dashboard).
2. El frontend envía datos a API routes en Next.js.
3. El backend persiste y consulta información en Airtable.
4. Make orquesta automatizaciones y dispara procesos de IA.
5. OpenAI procesa datos financieros y devuelve recomendaciones.
6. Los resultados se guardan en Airtable.
7. El dashboard muestra insights y recomendaciones al usuario.

## Estructura del proyecto

```txt
/home-finance-copilot
├── app
│   ├── api
│   │   ├── events
│   │   │   └── route.ts
│   │   ├── financial-profile
│   │   │   └── route.ts
│   │   └── user
│   │       └── route.ts
│   ├── dashboard
│   │   └── page.tsx
│   └── register
│       └── page.tsx
├── components
│   └── DashboardCard.tsx
├── lib
│   └── airtable.ts
└── types
    └── index.ts
```

## Variables de entorno sugeridas

Crea un archivo `.env.local`:

```bash
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
OPENAI_API_KEY=your_openai_api_key
MAKE_WEBHOOK_URL=your_make_webhook_url
```

## Siguientes pasos

- Añadir autenticación (Clerk, Auth.js o Supabase Auth).
- Conectar formularios de `register` a `app/api/user`.
- Crear tablas en Airtable (`users`, `financial_profiles`, `events`, `insights`).
- Configurar escenario en Make para procesar eventos con OpenAI.
