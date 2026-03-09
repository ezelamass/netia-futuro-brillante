

# Plan: Sistema de Tests Diagnósticos para NETIA

## Contexto
La página `/training` muestra un radar diagnóstico con 4 ejes (Físico, Técnico, Táctico, Mental) pero los datos son mock. Necesitamos implementar tests reales que el jugador pueda completar y almacenar en Supabase.

## Arquitectura de Datos

### Nuevas Tablas en Supabase

```text
┌─────────────────────────────────────────────────────────────────┐
│  diagnostic_tests (plantillas de tests)                         │
├─────────────────────────────────────────────────────────────────┤
│  id, axis (físico|técnico|táctico|mental), title, description,  │
│  sport, question_count, estimated_minutes, is_active            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  diagnostic_questions (preguntas de cada test)                  │
├─────────────────────────────────────────────────────────────────┤
│  id, test_id, order_index, question_text, question_type         │
│  (likert|choice|numeric|text), options (jsonb), weight          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  diagnostic_sessions (sesiones de test completadas)             │
├─────────────────────────────────────────────────────────────────┤
│  id, user_id, test_id, axis, started_at, completed_at,          │
│  total_score, max_score, normalized_score (0-10), notes         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  diagnostic_responses (respuestas individuales)                 │
├─────────────────────────────────────────────────────────────────┤
│  id, session_id, question_id, response_value, score             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  diagnostic_history (historial agregado por eje)                │
├─────────────────────────────────────────────────────────────────┤
│  id, user_id, axis, score, detail, recorded_at, cycle_id        │
└─────────────────────────────────────────────────────────────────┘
```

### Tipos de Tests por Eje

| Eje | Ejemplos de Preguntas | Tipo |
|-----|----------------------|------|
| **Físico** | Fuerza percibida, resistencia, movilidad, velocidad | Likert 1-5, numérico |
| **Técnico** | Dominio de golpes, consistencia, eficiencia | Likert 1-5, autoevaluación |
| **Táctico** | Lectura de juego, toma de decisiones, variación | Likert 1-5, situacional |
| **Mental** | Concentración, manejo de presión, constancia | Likert 1-5, escala emocional |

## Componentes UI a Crear

### 1. `src/pages/DiagnosticTest.tsx`
Nueva página `/diagnostic` con:
- Lista de tests disponibles por eje
- Estado de cada test (pendiente, completado, fecha)
- Botón para iniciar test

### 2. `src/components/diagnostic/TestCard.tsx`
Card para cada test mostrando:
- Eje (con color), título, descripción
- Tiempo estimado, número de preguntas
- Estado (completado/pendiente)

### 3. `src/components/diagnostic/TestRunner.tsx`
Modal/pantalla de ejecución:
- Progreso (pregunta X de N)
- Renderizado de pregunta según tipo
- Navegación anterior/siguiente
- Guardar y finalizar

### 4. `src/components/diagnostic/QuestionTypes/`
- `LikertQuestion.tsx` - Escala 1-5 con emojis
- `NumericQuestion.tsx` - Input numérico con validación
- `ChoiceQuestion.tsx` - Selección múltiple
- `TextQuestion.tsx` - Respuesta abierta

### 5. `src/components/diagnostic/TestResults.tsx`
Pantalla de resultados post-test:
- Score obtenido vs máximo
- Comparación con evaluación anterior
- Feedback por área

### 6. `src/hooks/useDiagnostic.ts`
Hook para:
- Cargar tests disponibles
- Cargar historial de diagnósticos
- Guardar sesión y respuestas
- Calcular scores

## Integración con Training Page

```text
DiagnosticRadar (existente)
         │
         ├── onClick en eje → navega a /diagnostic?axis=físico
         │
         └── Muestra scores reales desde diagnostic_history
```

## Flujo del Usuario

1. Jugador entra a `/training` → ve radar con últimos scores (o vacío)
2. Click en "Realizar Diagnóstico" o en un eje específico
3. Ve lista de tests disponibles para ese eje
4. Selecciona test → abre TestRunner
5. Completa preguntas → ve resultados
6. Scores se actualizan en radar

## Archivos a Crear/Modificar

### Crear:
- `src/pages/DiagnosticTest.tsx`
- `src/components/diagnostic/TestCard.tsx`
- `src/components/diagnostic/TestRunner.tsx`
- `src/components/diagnostic/TestResults.tsx`
- `src/components/diagnostic/questions/LikertQuestion.tsx`
- `src/components/diagnostic/questions/NumericQuestion.tsx`
- `src/components/diagnostic/questions/ChoiceQuestion.tsx`
- `src/components/diagnostic/index.ts`
- `src/hooks/useDiagnostic.ts`
- `src/types/diagnostic.ts`
- `src/data/seedDiagnosticTests.ts` (datos semilla para tests)

### Modificar:
- `src/App.tsx` - agregar ruta `/diagnostic`
- `src/components/training/DiagnosticRadar.tsx` - conectar a datos reales
- `src/pages/Training.tsx` - botón "Realizar Diagnóstico"
- `src/layouts/AppLayout.tsx` - link en sidebar (opcional)

### Migración SQL:
- Crear tablas: `diagnostic_tests`, `diagnostic_questions`, `diagnostic_sessions`, `diagnostic_responses`, `diagnostic_history`
- RLS policies para cada tabla
- Insertar datos semilla (tests predefinidos por eje)

## Datos Semilla (Ejemplo Test Físico)

```typescript
{
  axis: 'físico',
  title: 'Evaluación Física General',
  questions: [
    { text: '¿Cómo calificarías tu resistencia aeróbica?', type: 'likert' },
    { text: '¿Cuántas sentadillas podés hacer en 60 segundos?', type: 'numeric' },
    { text: '¿Sentís fatiga muscular durante entrenamientos largos?', type: 'likert' },
    { text: '¿Cómo es tu velocidad de reacción?', type: 'likert' },
    { text: '¿Tenés alguna limitación de movilidad?', type: 'choice', options: ['Ninguna', 'Leve', 'Moderada', 'Significativa'] }
  ]
}
```

## Resumen de Entregables

| Item | Tipo |
|------|------|
| 5 tablas Supabase + RLS | Migración SQL |
| 1 página nueva `/diagnostic` | React page |
| 6 componentes UI | React components |
| 1 hook `useDiagnostic` | Custom hook |
| 1 tipo TypeScript | Type definitions |
| Datos semilla (4 tests, ~20 preguntas) | SQL insert |
| Integración con Training page | Modificación |

