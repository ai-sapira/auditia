import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a real scenario, strict error handling for missing env var is needed.
// Here we allow it to fail gracefully or return mocks if key is missing for demo purposes.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToAssistant = async (message: string, context?: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock response.");
    // Mock delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "No he podido conectar con el modelo (Falta API Key). Sin embargo, en modo demo puedo decirte que el riesgo en Proveedores ha aumentado un 15% respecto al año anterior.";
  }

  try {
    // Use gemini-2.5-flash for low latency chat interactions
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `You are Auditia AI, an expert audit assistant. 
    You are helpful, professional, and concise. 
    You have access to the following context about the current audit engagement: ${context || 'No context provided'}.
    Answer the user's query based on audit standards (NIA-ES, ISA) and the provided context.`;

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.";
  }
};
