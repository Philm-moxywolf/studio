'use server';

/**
 * @fileOverview This flow extracts user signals from online sources using platform and content agents,
 * and then classifies these signals based on relevance to the input JTBD hunches and struggles.
 *
 * - extractAndClassifyUserSignals - A function that orchestrates the extraction and classification of user signals.
 * - ExtractAndClassifyUserSignalsInput - The input type for the extractAndClassifyUserSignals function.
 * - ExtractAndClassifyUserSignalsOutput - The return type for the extractAndClassifyUserSignals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define schemas for input and output
const ExtractAndClassifyUserSignalsInputSchema = z.object({
  jtbdHunches: z.string().describe('JTBD hunches to guide signal extraction.'),
  struggles: z.string().describe('Struggles users face, used to classify signal relevance.'),
  platformAgentResponses: z.array(z.string()).describe('Responses from platform agents.'),
  contentAgentResponses: z.array(z.string()).describe('Responses from content agents.'),
});
export type ExtractAndClassifyUserSignalsInput = z.infer<typeof ExtractAndClassifyUserSignalsInputSchema>;

const ClassifiedSignalSchema = z.object({
  signal: z.string().describe('The extracted user signal.'),
  source: z.string().describe('Source of the signal (e.g., Reddit, blog post URL).'),
  relevanceScore: z.number().describe('A score indicating the relevance of the signal to the JTBD hunches and struggles.'),
});

const ExtractAndClassifyUserSignalsOutputSchema = z.object({
  classifiedSignals: z.array(ClassifiedSignalSchema).describe('Classified user signals with relevance scores.'),
});
export type ExtractAndClassifyUserSignalsOutput = z.infer<typeof ExtractAndClassifyUserSignalsOutputSchema>;

// Define the main flow function
export async function extractAndClassifyUserSignals(input: ExtractAndClassifyUserSignalsInput): Promise<ExtractAndClassifyUserSignalsOutput> {
  return extractAndClassifyUserSignalsFlow(input);
}

// Define the prompt
const extractionAndClassificationPrompt = ai.definePrompt({
  name: 'extractionAndClassificationPrompt',
  input: {schema: ExtractAndClassifyUserSignalsInputSchema},
  output: {schema: ExtractAndClassifyUserSignalsOutputSchema},
  prompt: `You are an expert at extracting user signals from various sources and classifying them based on their relevance to specific JTBD hunches and struggles.

  Your goal is to analyze the responses from platform agents (social media) and content agents (blogs, articles) to identify relevant user signals and classify them.

  JTBD Hunches: {{{jtbdHunches}}}
  Struggles: {{{struggles}}}

  Platform Agent Responses:
  {{#each platformAgentResponses}}
  - {{{this}}}
  {{/each}}

  Content Agent Responses:
  {{#each contentAgentResponses}}
  - {{{this}}}
  {{/each}}

  For each signal, provide the signal itself, its source (URL or platform name), and a relevance score (0-10) indicating how well it aligns with the provided JTBD hunches and struggles. A higher score indicates greater relevance.

  Format your response as a JSON object conforming to the following schema:
  ${JSON.stringify(ExtractAndClassifyUserSignalsOutputSchema.shape, null, 2)}`,
});

// Define the flow
const extractAndClassifyUserSignalsFlow = ai.defineFlow(
  {
    name: 'extractAndClassifyUserSignalsFlow',
    inputSchema: ExtractAndClassifyUserSignalsInputSchema,
    outputSchema: ExtractAndClassifyUserSignalsOutputSchema,
  },
  async input => {
    const {output} = await extractionAndClassificationPrompt(input);
    return output!;
  }
);
