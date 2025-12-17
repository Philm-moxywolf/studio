import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // We use the 'googleai/' prefix which is required for the plugin lookup.
  // We use 'gemini-1.5-flash' as it is the most stable default.
  model: 'googleai/gemini-1.5-flash',
});
