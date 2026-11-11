// workers/api/src/routes/docente.ts

// Definimos el Env localmente para que TypeScript sepa qué variables esperar
export interface Env {
  DB: D1Database;
  GROQ_API_KEY: string;
}

// Helper local para respuestas JSON (así no dependemos de '../lib/helpers')
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function handleDocenteChat(request: Request, env: Env): Promise<Response> {
  try {
    // Tipamos el body para que TypeScript no se queje
    const body = await request.json() as { prompt?: string };
    const prompt = body.prompt;

    if (!prompt) {
      return jsonResponse({ ok: false, error: 'El prompt es requerido.' }, 400);
    }

    // Llamar al proveedor de IA
    const aiResponse = await callAIProvider(prompt, env);

    return jsonResponse({ ok: true, reply: aiResponse });

  } catch (error) {
    console.error('Error en el tutor docente:', error);
    return jsonResponse({ ok: false, error: 'Error interno del servidor.' }, 500);
  }
}

async function callAIProvider(prompt: string, env: Env): Promise<string> {
  // Configuración para Groq (API gratuita)
  const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const API_KEY = env.GROQ_API_KEY; 
  // Usamos un modelo disponible en Groq. Llama 3 es muy bueno y rápido.
  const MODEL = 'openai/gpt-oss-20b'; 

  const systemPrompt = "Eres un asistente experto para docentes de Chile. Ayudas a analizar el progreso y crear material pedagógico alineado al MINEDUC. Responde de forma clara, profesional y directa. IMPORTANTE: No uses tablas de Markdown, solo usa párrafos, negritas y listas con viñetas.";;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Error API Groq:', errText);
    throw new Error(`Error de la API de IA: ${response.statusText}`);
  }

  // Tipamos la respuesta como 'any' para evitar el error de 'data' is of type 'unknown'
  const data = await response.json() as any;
  return data.choices[0].message.content;
}
