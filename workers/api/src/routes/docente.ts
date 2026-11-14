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

  const systemPrompt = `Eres un experto diseñador instruccional chileno para educación básica y media, alineado con el MINEDUC.
Tu tarea es crear lecciones en formato JSON exacto para la plataforma.

REGLAS ESTRICTAS:
1. Devuelve ÚNICAMENTE el bloque JSON, sin explicaciones fuera de él.
2. Usa el siguiente esquema exacto:
{
  "id": "slug-del-tema",
  "titulo": "Título con emoji",
  "categoria": "Materia",
  "emoji": "Un emoji",
  "progreso_puntos": 100,
  "contenido_modulos": ["### Módulo 1...", "### Módulo 2..."],
  "banco_trivia": [
    {
      "id": "prefijo01",
      "dificultad": "media|dificil|muy_dificil",
      "pregunta": "...",
      "opciones": ["A", "B", "C", "D"],
      "respuesta_correcta": 0,
      "explicacion": "..."
    }
  ],
  "glosario": [{ "termino": "...", "emoji": "📖", "definicion": "..." }]
}

REGLAS DE CONTENIDO:
- Para los títulos de los módulos usa siempre '###', NUNCA '#'. (El sistema oculta los '#').
- El tono debe ser narrado, cercano y explicativo (como una profesora hablando).
- Incluye ejemplos visuales usando HTML simple (como <div class="bg-blue-100...">) si es necesario.
- El banco_trivia debe tener 8 preguntas mezclando dificultades. No siempre pongas la respuesta correcta en la misma letra.
- Usa lenguaje de Chile (ej. "pieza" en vez de "habitación", "computador").`;

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


// ... (tu código anterior de handleDocenteChat y callAIProvider)

export async function handleGuardarLeccion(request: Request, env: any): Promise<Response> {
  try {
    const { leccionJson, materiaId } = await request.json() as { leccionJson: any, materiaId: string };
    
    // 1. LIMPIAR EL ID: Evitamos espacios o caracteres raros
    const rawId = leccionJson.id || 'leccion-sin-id';
    const leccionId = rawId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    const folderPath = `src/data/materias/${materiaId}/lecciones`;
    const filePath = `${folderPath}/${leccionId}.json`;
    
    const contentEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(leccionJson, null, 2))));
    const headers = {
      'Authorization': `token ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Web-Educativa-Worker'
    };

    const baseUrl = `https://api.github.com/repos/Ferbeatriz/web-educativa/contents`;
    const fileUrl = `${baseUrl}/${filePath}`;

    // 2. Verificamos si el archivo ya existe para obtener su SHA
    let sha = undefined;
    const getRes = await fetch(fileUrl, { headers });
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 3. Guardamos la lección
    const putBody: any = {
      message: `Feat: lección autogenerada (${leccionId})`,
      content: contentEncoded,
      branch: 'main'
    };
    if (sha) putBody.sha = sha;

    const response = await fetch(fileUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Si falla, devolvemos la ruta exacta para saber qué está mal
      throw new Error(`Error GitHub: ${errorData.message} | Ruta intentada: ${filePath}`);
    }

    return jsonResponse({ ok: true, message: 'Lección guardada exitosamente.' });
  } catch (error: any) {
    console.error('Error guardando en GitHub:', error);
    return jsonResponse({ ok: false, error: error.message }, 500);
  }
}
