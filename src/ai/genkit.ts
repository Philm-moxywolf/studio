import {genkit} from 'genkit';
import {googleAI, gemini15Pro} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Pro,
});
