"use client";

import { useState, useEffect } from "react";

const MAX_USES = 5;
const STORAGE_KEY = "linkedin-translator-uses";

const EXAMPLES = [
  "Me echaron del trabajo",
  "I got fired from my job",
  "Reprobé mi examen de certificación por tercera vez",
  "My startup went bankrupt",
  "Me bloquearon en Twitter",
  "I showed up late to every meeting this week",
];

export default function Home() {
  const [situation, setSituation] = useState("");
  const [linkedinPost, setLinkedinPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [usesLeft, setUsesLeft] = useState(MAX_USES);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsesLeft(Math.max(0, MAX_USES - parseInt(stored, 10)));
    }
  }, []);

  const handleGenerate = async () => {
    if (!situation.trim() || usesLeft <= 0) return;
    setLoading(true);
    setError("");
    setLinkedinPost("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Algo salió mal");
      } else {
        setLinkedinPost(data.post);
        const stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
        const newCount = stored + 1;
        localStorage.setItem(STORAGE_KEY, String(newCount));
        setUsesLeft(Math.max(0, MAX_USES - newCount));
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!linkedinPost) return;
    await navigator.clipboard.writeText(linkedinPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExample = (example: string) => {
    setSituation(example);
    setCharCount(example.length);
    setLinkedinPost("");
    setError("");
  };

  const handleSituationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSituation(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-rene)] text-4xl text-gray-900 leading-none">René</span>
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a href="https://x.com/rene__hdz" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/renehdzgtz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Farcaster */}
              <a href="https://farcaster.xyz/renehdz" target="_blank" rel="noopener noreferrer" aria-label="Farcaster" className="text-gray-400 hover:text-[#8B5CF6] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.7 0h.6C18.8 0 24 5.2 24 11.7v.6C24 18.8 18.8 24 12.3 24h-.6C5.2 24 0 18.8 0 12.3v-.6C0 5.2 5.2 0 11.7 0zm-3.3 6l-.9 2.6h-.8V18h2.5v-5h3.6v5H16V8.6h-.8L14.3 6H8.4z" />
                </svg>
              </a>
              {/* Portfolio */}
              <a href="https://drive.google.com/file/d/1iF7YoXYz9HzkmUQVU9ohDQWRJgf7GbdG/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" aria-label="Portafolio" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {usesLeft <= 0 && !linkedinPost ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-6 block">🙌</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Gracias por probarlo!
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto mb-2">
              Has usado tus 5 traducciones gratuitas.
            </p>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Espero que te hayas divertido convirtiendo tus tragedias en posts virales de LinkedIn.
            </p>
            <p className="text-gray-400 text-sm mt-8 mb-4">
              — René
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://x.com/rene__hdz" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/renehdzgtz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://farcaster.xyz/renehdz" target="_blank" rel="noopener noreferrer" aria-label="Farcaster" className="text-gray-400 hover:text-[#8B5CF6] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.7 0h.6C18.8 0 24 5.2 24 11.7v.6C24 18.8 18.8 24 12.3 24h-.6C5.2 24 0 18.8 0 12.3v-.6C0 5.2 5.2 0 11.7 0zm-3.3 6l-.9 2.6h-.8V18h2.5v-5h3.6v5H16V8.6h-.8L14.3 6H8.4z" />
                </svg>
              </a>
              <a href="https://drive.google.com/file/d/1iF7YoXYz9HzkmUQVU9ohDQWRJgf7GbdG/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" aria-label="Portafolio" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Title & Subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Convierte tus problemas en un post de LinkedIn.
              </h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto">
                El traductor que te ayuda a transformar una tragedia en un post viral para LinkedIn, con un &ldquo;aprendizaje&rdquo; listo para publicar.
              </p>
            </div>

            {/* Translator card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Language bar */}
              <div className="flex items-stretch border-b border-gray-200">
                <div className="flex-1 px-5 py-3 border-r border-gray-200">
                  <span className="text-sm font-medium text-gray-800">Lo que pasó de verdad</span>
                </div>
                <div className="flex items-center justify-center px-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <div className="flex-1 px-5 py-3 border-l border-gray-200 flex items-center gap-2">
                  <span className="text-sm font-medium text-[#0A66C2]">LinkedIn Speak</span>
                  <span className="text-xs bg-[#0A66C2] text-white px-2 py-0.5 rounded-full">✨ AI</span>
                </div>
              </div>

              {/* Text areas */}
              <div className="flex min-h-[260px]">
                {/* Input */}
                <div className="flex-1 flex flex-col border-r border-gray-200">
                  <textarea
                    className="flex-1 p-5 text-gray-800 placeholder-gray-400 resize-none focus:outline-none text-base leading-relaxed bg-transparent"
                    placeholder="Ej: Me echaron del trabajo, mi startup quebró, me salió mal la entrevista..."
                    value={situation}
                    onChange={handleSituationChange}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{charCount} / 500</span>
                    {situation && (
                      <button
                        onClick={() => { setSituation(""); setCharCount(0); setLinkedinPost(""); setError(""); }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Borrar
                      </button>
                    )}
                  </div>
                </div>

                {/* Output */}
                <div className="flex-1 flex flex-col bg-gray-50/50">
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <p className="text-sm text-gray-500">Transformando en jerga corporativa...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex-1 flex items-center justify-center p-5">
                      <div className="text-center">
                        <span className="text-2xl">⚠️</span>
                        <p className="text-sm text-red-500 mt-2">{error}</p>
                      </div>
                    </div>
                  ) : linkedinPost ? (
                    <div className="flex-1 p-5 overflow-y-auto">
                      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">{linkedinPost}</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-5">
                      <p className="text-gray-400 text-sm text-center">
                        Tu post de LinkedIn aparecerá aquí 🚀
                      </p>
                    </div>
                  )}

                  {linkedinPost && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
                      <span className="text-xs text-gray-400">{linkedinPost.length} caracteres</span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-[#0A66C2] hover:text-[#004182] transition-colors font-medium"
                      >
                        {copied ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copiar post
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate / Copy button */}
              <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between bg-gray-50/50">
                <p className="text-xs text-gray-400">{linkedinPost ? "" : `${usesLeft} uso${usesLeft !== 1 ? "s" : ""} restante${usesLeft !== 1 ? "s" : ""}`}</p>
                {linkedinPost ? (
                  <button
                    onClick={handleCopy}
                    className="bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar post
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !situation.trim()}
                    className="bg-[#0A66C2] hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Traducir a LinkedIn
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="mt-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Ejemplos rápidos</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExample(ex)}
                    className="text-sm bg-white border border-gray-300 text-gray-700 rounded-full px-4 py-1.5 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Proyecto satírico. Inspirado en el meme &ldquo;Google Translate for LinkedIn&rdquo; 😂
            </p>
          </>
        )}
      </main>
    </div>
  );
}
