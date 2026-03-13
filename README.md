# Home Finance Copilot ✨

**Asistente financiero personal inteligente** construido con Next.js, Airtable, Make e IA.

Gestiona tu situación financiera, actualiza tus datos, registra eventos y recibe recomendaciones personalizadas de tu copilot financiero.

## Características principales

✅ **Autenticación segura** - Registro e inicio de sesión con JWT  
✅ **Perfil financiero dinámico** - Ingresos, gastos, ahorros, hipotecas y préstamos  
✅ **Historial de cambios** - Rastrea todas las versiones de tu perfil  
✅ **Registro de eventos** - Ingreso extra, gastos inesperados, amortizaciones  
✅ **Análisis de IA** - Evaluación de salud financiera automática  
✅ **Recomendaciones inteligentes** - Sugerencias personalizadas basadas en tu situación  
✅ **Chat interactivo** - Comunicate con tu copilot financiero  
✅ **Historial unificado** - Vista cronológica de perfil, eventos e insights  

## Tecnología

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Airtable |
| Automatización | Make |
| IA | OpenAI + Claude |
| Autenticación | JWT |

## Estructura del proyecto

```
home-finance-copilot/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── register/route.ts
│   │   ├── chat/route.ts
│   │   ├── events/route.ts
│   │   ├── financial-events/route.ts
│   │   ├── financial-profile/route.ts
│   │   └── user/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── AddEventModal.tsx
│   ├── AIAnalysisBlock.tsx
│   ├── AICopilotChat.tsx
│   ├── FinancialOverview.tsx
│   ├── InitialFinancialForm.tsx
│   ├── LogoutButton.tsx
│   ├── QuickActions.tsx
│   ├── UnifiedHistory.tsx
│   └── UpdateProfileModal.tsx
├── lib/
│   ├── airtable.ts
│   ├── auth.ts
│   └── chat.ts
├── types/
│   ├── financial.ts
│   └── index.ts
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Tablas de Airtable

### Users
- `UserId` - ID único del usuario (texto)
- `Email` - Email del usuario (email)
- `PasswordHash` - Contraseña hasheada (texto)
- `CustomId` - ID personalizado para búsquedas (texto)
- `CreatedAt` - Fecha de creación (formulario)

### FinancialProfiles
- `Id` - ID único (texto)
- `UserId` - Referencia al usuario (enlace)
- `MonthlyIncome` - Ingresos mensuales (número)
- `MonthlyExpenses` - Gastos mensuales (número)
- `CurrentSavings` - Ahorros actuales (número)
- `MortgageInitialAmount` - Importe inicial hipoteca (número)
- `MortgageCurrentAmount` - Importe actual hipoteca (número)
- `MortgageInterest` - Interés hipoteca (%) (número)
- `MortgageEndDate` - Fecha fin hipoteca (fecha)
- `LoanInitialAmount` - Importe inicial préstamo (número)
- `LoanCurrentAmount` - Importe actual préstamo (número)
- `LoanInterest` - Interés préstamo (%) (número)
- `LoanEndDate` - Fecha fin préstamo (fecha)
- `Children` - Número de hijos (número)
- `FinancialGoal` - Objetivo financiero (texto)
- `ProfileCreated` - Fecha de creación (formulario)

### FinancialEvents
- `Id` - ID único (texto)
- `UserId` - Referencia al usuario (enlace)
- `EventType` - Tipo de evento (selección: `amortization`, `extra_income`, `unexpected_expense`, `goal_reached`, `other`)
- `Amount` - Cantidad (número)
- `Description` - Descripción (texto)
- `Date` - Fecha del evento (fecha)

### AIInsights
- `Id` - ID único (texto)
- `UserId` - Referencia al usuario (enlace)
- `HealthScore` - Puntuación de salud (0-100) (número)
- `RiskLevel` - Nivel de riesgo (selección: `Bajo`, `Medio`, `Alto`)
- `Insights` - Puntos clave del análisis (texto)
- `Recommendations` - Recomendaciones personalizadas (texto)
- `Date` - Fecha del análisis (formulario)

### AIJobs
- `Id` - ID único (texto)
- `UserId` - Referencia al usuario (enlace)
- `JobType` - Tipo de trabajo (selección: `initial_analysis`, `periodic_update`, `financial_event`)
- `Status` - Estado (selección: `pending`, `processing`, `completed`, `error`)
- `Payload` - Datos del trabajo (texto JSON)
- `CreatedAt` - Fecha de creación (formulario)

## Endpoints de API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |

### Perfil Financiero
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/financial-profile` | Obtener perfil actual y todos los hists |
| POST | `/api/financial-profile` | Crear/actualizar perfil (crea nuevo registro) |

### Eventos Financieros
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/financial-events` | Listar eventos del usuario |
| POST | `/api/financial-events` | Registrar nuevo evento |

### Chat
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/chat` | Enviar mensaje al copilot |

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone <repositorio>
cd home-finance-copilot
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local`:
```bash
# Airtable
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Autenticación
JWT_SECRET=tu_secreto_super_seguro_123456789

# Make Webhook
MAKE_CHAT_WEBHOOK_URL=https://hook.eu1.make.com/XXXXXXXXXXXXXXXX
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

### 5. Build para producción
```bash
npm run build
npm run start
```

## Flujo de usuario

1. **Registro** - El usuario se registra con email y contraseña
2. **Configuración inicial** - Completa su perfil financiero
3. **Dashboard** - Ve su visión general y objetivo
4. **Acciones** - Registra eventos o actualiza su perfil
5. **Análisis** - Recibe análisis automático de su salud financiera
6. **Chat** - Interactúa con el copilot para obtener recomendaciones

## Características avanzadas

### Historial de Perfiles
Cada actualización de perfil crea un nuevo registro, manteniendo histórico completo:
- Inicial de configuración
- Actualizaciones posteriores
- Todos los cambios registrados en la línea de tiempo

### Cambios de Deuda
- **Hipotecas:** Importe inicial, importe actual y fecha de fin
- **Préstamos:** Importe inicial, importe actual y fecha de fin
- Seguimiento visual de progreso de amortización

### Análisis Inteligente
- Evaluación automática de salud financiera (0-100)
- Clasificación de riesgo (Bajo, Medio, Alto)
- Insights clave personalizados
- Recomendaciones accionables

## Mejoras futuras

- [ ] Exportación de reportes PDF
- [ ] Predicción de ahorro mensual
- [ ] Alertas de cambios importantes
- [ ] Integración con bancos
- [ ] Análisis de tendencias
- [ ] Compartir objetivos con otros usuarios

## Contribuir

Este proyecto está en desarrollo activo. Para contribuir:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT License - Ver LICENSE para más detalles.
