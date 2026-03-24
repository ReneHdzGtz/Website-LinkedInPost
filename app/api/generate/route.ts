import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { situation } = await request.json();

    if (!situation?.trim()) {
      return NextResponse.json(
        { error: "Se requiere una situación" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: situation,
        },
      ],
      system: `Eres un experto en transformar situaciones cotidianas (buenas, malas o neutras) en posts de LinkedIn con el típico tono motivacional, positivo y lleno de buzzwords corporativos.

Tu trabajo es tomar lo que le pasó a alguien y convertirlo en un post de LinkedIn que:
- Enmarca todo como una "oportunidad de crecimiento" o "nuevo capítulo emocionante"
- Usa frases como: "Thrilled to announce", "Excited to share", "Humbled and grateful", "This journey has taught me", "Pivoting to the next chapter", "Leaning into the discomfort"
- Incluye al menos 2-3 emojis relevantes
- Agrega hashtags al final (#GrowthMindset #NewChapter #ProfessionalDevelopment #Grateful #Learning)
- Menciona aprendizajes, resiliencia o liderazgo cuando sea posible
- Tiene entre 150-300 palabras
- Suena auténtico al estilo LinkedIn: serio pero emotivo, profesional pero personal

IMPORTANTE:
- No importa qué tan mala o ridícula sea la situación real, siempre transfórmala en algo positivo y profesional.
- Responde ÚNICAMENTE con el post de LinkedIn, sin explicaciones adicionales.
- Escribe el post en el mismo idioma que la situación recibida (si es en español, el post en español; si es en inglés, el post en inglés).`,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return NextResponse.json({ post: content.text });
  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Error al generar el post: ${message}` },
      { status: 500 }
    );
  }
}
