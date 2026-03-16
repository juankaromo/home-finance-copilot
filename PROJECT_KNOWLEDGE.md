# HomeFinance Copilot - Documentación del Proyecto

## 📋 Descripción General

**HomeFinance Copilot** es una aplicación web para gestionar finanzas personales con asistencia de IA. Permite a usuarios:
- Registrarse y crear un perfil financiero
- Registrar eventos financieros (gastos, ingresos, etc.)
- Obtener análisis automáticos de su situación económica
- Chatear con un asistente IA para obtener recomendaciones personalizadas
- Ver un historial completo de cambios en su perfil financiero

**Público objetivo**: Personas de todos los niveles de conocimiento financiero que buscan entender mejor su situación económica sin jerga técnica.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript |
| **Styling** | Tailwind CSS |
| **Base de datos** | Airtable (base externa) |
| **Autenticación** | JWT con cookies |
| **IA/LLM** | OpenAI/Claude via Make.com (webhooks) |
| **Automatización** | Make.com (escenarios) |

---

## 📁 Estructura de Directorios

```
/app
  /api                          # API endpoints
    /auth
      /login/route.ts          # Login authentication
      /logout/route.ts         # Logout (clear cookies)
      /register/route.ts       # User registration
    /chat/route.ts             # Chat con asistente IA
    /events/route.ts           # Endpoints de eventos (Legacy)
    /financial-events/route.ts # Crear/obtener eventos financieros
    /financial-profile/route.ts # Crear/obtener perfil financiero
  /dashboard/page.tsx          # Dashboard principal (autenticado)
  /login/page.tsx              # Página de login
  /register/page.tsx           # Página de registro
  /layout.tsx                  # Layout global con metadata
  /page.tsx                    # Landing page pública
  /globals.css                 # Estilos globales

/components                     # Componentes React reutilizables
  /AddEventModal.tsx           # Modal para agregar eventos
  /AIAnalysisBlock.tsx         # Bloque de análisis IA
  /AICopilotChat.tsx           # Chat con IA
  /FinancialOverview.tsx       # Resumen financiero
  /InitialFinancialForm.tsx    # Formulario inicial de setup
  /LogoutButton.tsx            # Botón de logout
  /QuickActions.tsx            # Acciones rápidas (actualizar perfil)
  /UnifiedHistory.tsx          # Historial unificado de cambios
  /UpdateProfileModal.tsx      # Modal para actualizar perfil

/lib                            # Utilidades y configuraciones
  /airtable.ts                 # Cliente y funciones Airtable
  /auth.ts                     # Funciones de autenticación
  /db.ts                       # Funciones de base de datos (Legacy)

/types                          # TypeScript interfaces
  /financial.ts                # Tipos financieros
  /index.ts                    # Exports de tipos

/public
  /favicon.svg                 # Favicon (H azul con gradiente)
```

---

## 💾 Modelos de Datos

### Users (Tabla Airtable)
```typescript
{
  id: string;                  // UUID generado
  Email: string;               // Email único
  Password: string;            // Hash bcrypt
  CreatedAt: string;           // Timestamp ISO
  Name?: string;               // Nombre del usuario
}
```

### FinancialProfiles (Tabla Airtable)
```typescript
{
  id: string;                  // UUID
  UserId: string;              // FK a Users
  ProfileCreated: string;      // Timestamp (auto-generado por Airtable)
  
  // Ingresos y gastos
  MonthlyIncome: number;       // Ingreso mensual
  MonthlyExpenses: number;     // Gastos mensuales
  MonthlySavings: number;      // Ahorros mensuales
  
  // Hipoteca
  MortgageInitialAmount: number;    // Monto inicial
  MortgageCurrentAmount: number;    // Monto actual
  MortgageInterest: number;         // Tasa de interés (%)
  MortgageEndDate: string;          // Fecha de vencimiento (ISO)
  
  // Préstamo
  LoanInitialAmount: number;        // Monto inicial
  LoanCurrentAmount: number;        // Monto actual
  LoanInterest: number;             // Tasa de interés (%)
  LoanEndDate: string;              // Fecha de vencimiento (ISO)
  
  // Metas
  SavingsGoal: number;        // Meta de ahorro anual
}
```

**Importante**: Cada actualización del perfil crea un NUEVO registro, no actualiza el existente. Esto permite rastrear el historial completo.

### FinancialEvents (Tabla Airtable)
```typescript
{
  id: string;                  // UUID
  UserId: string;              // FK a Users
  FinancialProfileId: string;  // FK a FinancialProfiles
  Date: string;                // ISO timestamp
  Type: "income" | "expense" | "transfer" | "debt_payment";
  Description: string;         // Descripción del evento
  Amount: number;              // Monto
  CreatedAt: string;           // Timestamp creación
}
```

### AIInsights (Tabla Airtable)
```typescript
{
  id: string;                  // UUID
  UserId: string;              // FK a Users
  FinancialProfileId: string;  // FK a FinancialProfiles (la que se analizó)
  Analysis: string;            // Análisis JSON con estructura:
  {
    "score": 0-100,
    "classification": "under-risk" | "at-risk" | "stable" | "healthy",
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": [{
      "title": string,
      "description": string,
      "priority": "high" | "medium" | "low",
      "impactMonths": number
    }]
  }
  AIJobId: string;             // FK a AIJobs (que generó este análisis)
  CreatedAt: string;           // Timestamp
}
```

### AIJobs (Tabla Airtable)
```typescript
{
  id: string;                  // UUID
  UserId: string;              // FK a Users
  JobType: "initial_analysis" | "periodic_update";
  Status: "pending" | "processing" | "completed" | "failed";
  FinancialProfileId: string;  // La que se procesó
  CreatedAt: string;
  UpdatedAt: string;
  MakeWebhookResponse?: string; // Respuesta del webhook de Make
}
```

---

## 🔌 API Endpoints

### Autenticación

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```
Respuesta: JWT en cookie + User data

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```
Respuesta: JWT en cookie + User data

**POST /api/auth/logout**
Limpia la cookie de sesión.

### Perfil Financiero

**GET /api/financial-profile**
Devuelve:
- `currentProfile`: FinancialProfile actual
- `profileHistories`: Array de TODOS los perfiles históricos del usuario (ordenados por date)
- `latestInsight`: AIInsight más reciente
- `hasActiveJob`: boolean (si hay AIJob en proceso)

**POST /api/financial-profile**
```json
{
  "monthlyIncome": 5000,
  "monthlyExpenses": 3000,
  "monthlySavings": 500,
  "mortgageInitialAmount": 200000,
  "mortgageCurrentAmount": 150000,
  "mortgageInterest": 2.5,
  "mortgageEndDate": "2035-03-15",
  "loanInitialAmount": 0,
  "loanCurrentAmount": 0,
  "loanInterest": 0,
  "loanEndDate": null,
  "savingsGoal": 10000
}
```
- Si el usuario NO tiene perfil: crea uno + AIJob tipo "initial_analysis"
- Si el usuario YA tiene perfil: crea uno NUEVO (hereda campos del anterior) + AIJob tipo "periodic_update"

Devuelve: `{ success: true, job: AIJob }`

### Eventos Financieros

**GET /api/financial-events**
Devuelve array de FinancialEvent del usuario.

**POST /api/financial-events**
```json
{
  "type": "expense",
  "description": "Café",
  "amount": 5
}
```
Crea evento ligado al perfil actual del usuario.

### Chat IA

**POST /api/chat**
```json
{
  "question": "¿Cómo puedo ahorrar más dinero?"
}
```
Respuesta: Stream de texto del asistente IA (Make.com webhook)

**Nota**: El chat está deshabilitado (`isDisabled={true}`) si:
- No existe AIInsight para el usuario, O
- Hay un AIJob activo en procesamiento

---

## 🧩 Componentes Principales

### `InitialFinancialForm`
- Usado en el dashboard cuando usuario no tiene perfil
- Grid de 4 columnas para cada deuda (inicial, actual, interés, vencimiento)
- Submit dispara POST a `/api/financial-profile`

### `UpdateProfileModal`
- Modal para actualizar perfil existente
- Solo permite cambiar: ingresos, gastos, ahorros, meta
- Submit crea NUEVO perfil (no actualiza)

### `AddEventModal`
- Modal para registrar eventos financieros
- Tipos: "income", "expense", "transfer", "debt_payment"
- POST a `/api/financial-events`

### `AICopilotChat`
- Interfaz de chat con IA
- Prop `isDisabled`: deshabilita input si no hay análisis o hay job activo
- POST a `/api/chat` con trailing spaces para streaming
- Muestra indicador "Análisis en progreso..." cuando está deshabilitado

### `AIAnalysisBlock`
- Muestra único análisis de IA más reciente
- Renderiza score, clasificación, fortalezas, debilidades, recomendaciones
- Se actualiza en tiempo real cuando llega nuevo análisis

### `UnifiedHistory`
- Historial unificado de:
  - Eventos financieros
  - Cambios de perfil
  - Nuevos análisis de IA
- Ordenado cronológicamente ascendente
- Tipos: "event", "profile_change", "analysis"

### `FinancialOverview`
- Resumen visual del perfil actual
- Muestra: ingresos, gastos, ahorros, meta
- Detalles de hipoteca/préstamo: inicial + actual + interés + vencimiento
- Colores indicativos (rojo si hay deuda, verde si está ok)

---

## 🔐 Autenticación y Sesión

### Flujo JWT
1. Usuario se registra/loguea
2. Backend genera JWT con `userId` + `sub`
3. JWT se guarda en cookie `token` (httpOnly en prod)
4. Cada request incluye `Authorization: Bearer {jwt}`
5. El middleware `getAuthUser()` valida JWT

### Middleware
- Todas las rutas `/api/*` requieren JWT válido
- Dashboard requiere autenticación (redirecciona a login si no existe)
- Landing page es pública

---

## 🤖 Integración con Make.com

### Flujo de Análisis
1. Usuario completa perfil (POST `/api/financial-profile`)
2. Backend crea AIJob con status "pending"
3. Backend trigger webhook a Make.com: `MAKE_CHAT_WEBHOOK_URL`
4. Payload: `{ userId, jobId, financialProfileId }`
5. Make escenario recibe webhook y:
   - Llama OpenAI/Claude con contexto financiero
   - Genera análisis (score, recs, etc.)
   - Actualiza AIJob a "completed"
   - Crea AIInsight con análisis
6. Dashboard detecta cambio y actualiza UI con nuevo análisis

### Flujo de Chat
1. Usuario envía pregunta en AICopilotChat
2. POST `/api/chat` con `{ question }`
3. Backend llama Make webhook: `MAKE_CHAT_WEBHOOK_URL`
4. Payload incluye: `{ userId, profileId, question, latestAnalysis }`
5. Make llama OpenAI/Claude
6. Respuesta en streaming se envía al cliente
7. Se renderiza en tiempo real

---

## 📱 Flujo de Usuario

### Primer acceso
1. Usuario llega a landing (app/page.tsx)
2. Ve descripción, beneficios, CTA
3. Hace click en "Crea tu cuenta ahora"
4. Registra email + password (app/register/page.tsx)
5. Se loguea automáticamente
6. Redirige a dashboard
7. Dashboard detecta que NO tiene perfil
8. Muestra InitialFinancialForm
9. Usuario completa formulario y submit
10. Se crea FinancialProfile + AIJob
11. Dashboard muestra "Análisis en progreso..."

### Análisis generado
1. AIJob se completa (Make.com webhook lo marca como "completed")
2. Se crea AIInsight
3. Dashboard re-fetch perfil y obtiene nuevo análisis
4. AIAnalysisBlock renderiza análisis
5. AICopilotChat se habilita (antes estaba deshabilitado)
6. UnifiedHistory muestra "Análisis generado"

### Uso regular
- Usuario ve su análisis, recomendaciones
- Puede preguntar al chat
- Puede agregar eventos (AddEventModal)
- Puede actualizar perfil (UpdateProfileModal) → crea nuevo perfil + AIJob
- Ve historial completo de cambios

---

## ⚙️ Configuración

### Variables de Entorno
```
# Base de datos
AIRTABLE_TOKEN=xxx
AIRTABLE_BASE_ID=xxx
AIRTABLE_TABLE_USERS=Users
AIRTABLE_TABLE_PROFILES=FinancialProfiles
AIRTABLE_TABLE_EVENTS=FinancialEvents
AIRTABLE_TABLE_INSIGHTS=AIInsights
AIRTABLE_TABLE_JOBS=AIJobs

# JWT
JWT_SECRET=xxx

# Make.com webhooks
MAKE_CHAT_WEBHOOK_URL=https://hook.make.com/...
```

### Metadata del Proyecto
- Title: "HomeFinance Copilot"
- Description: "Tu asistente financiero con IA"
- Favicon: `public/favicon.svg` (H azul con gradiente)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor Next.js

# Producción
npm run build        # Compila proyecto
npm run start        # Inicia servidor producción

# Lint/Format
npm run lint         # Ejecuta ESLint
```

---

## 📌 Consideraciones Importantes

### Campo ProfileCreated
- **NO** se asigna manualmente en POST
- **SE** auto-genera en Airtable como timestamp
- Al crear nuevo perfil, el campo se auto-llena con la fecha actual
- Esto permite rastrear cuándo se creó cada versión de perfil

### Versionado de Perfil
- **NUNCA** actualizar registro existente con PUT/PATCH
- **SIEMPRE** crear uno nuevo con POST
- El endpoint GET devuelve todos los perfiles en array `profileHistories`
- El dashboard mapea `profileHistories` a items de historial con:
  - Último perfil: "Perfil financiero inicial creado"
  - Anteriores: "Perfil actualizado"

### Chat Deshabilitado
- Chat está DESHABILITADO si: `!analysis || hasActiveJob`
- Esto significa:
  - No hay análisis todavía (usuario acaba de registrarse), O
  - Hay AIJob en proceso (esperando análisis nuevo después de actualizar)
- Cuando se deshabilita, muestra placeholder: "Completa tu análisis para usar el chat"

### Tipos AIJob
- `initial_analysis`: Primer perfil del usuario
- `periodic_update`: Actualizaciones posteriores del perfil
- Ambos disparan webhook Make para generar AIInsight

### Seguridad
- Contraseñas se hashean con bcrypt
- JWT valida todos los endpoints protegidos
- Cookie httpOnly en producción
- Usuario solo puede ver sus propios datos (filtro por userId)

---

## 🚀 Roadmap Futuro

Posibles mejoras:
- Exportación de reportes PDF
- Notificaciones de hitos alcanzados
- Integración con bancos (open banking)
- Presupuestos mensuales
- Simulaciones de escenarios ("¿Y si ahorrase $X?")
- Comparación con promedios similares (anónimos)
- Mobile app

---

## 📞 Notas Finales

Este documento debe ser actualizado cada vez que:
- Se agreguen nuevos endpoints
- Se cambien los modelos de datos en Airtable
- Se creen nuevos componentes importantes
- Se añadan features significativas

Mantener este documento actualizado garantiza que nuevos agentes/modelos puedan entender rápidamente la arquitectura del proyecto.
