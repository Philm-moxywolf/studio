import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // FIX: Use the 'googleai/' prefix and the stable 'gemini-1.5-flash' model
  // to prevent 404 errors from the API.
  model: 'googleai/gemini-1.5-flash', 
});
