'use server';

/**
 * @fileOverview This flow analyzes the uploaded company knowledge base and generates initial insights or search queries related to the business vertical, USP, and JTBD hunches.
 *
 * - generateInsights - A function that generates insights from the knowledge base.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  knowledgeBase: z
    .string()
    .describe('The company information knowledge base.'),
  businessVertical: z.string().describe('The business vertical of the company.'),
  usps: z.string().describe('The unique selling points of the company.'),
  jtbdHunches: z.string().describe('The JTBD hunches related to the company.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights or search queries.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

const generateInsightsPrompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an expert in analyzing company information and generating insights for signal hunting.

  Based on the following company information, business vertical, USP, and JTBD hunches, generate initial insights or search queries to start the signal hunting process.

  Company Information:
  {{knowledgeBase}}

  Business Vertical:
  {{businessVertical}}

  USPs:
  {{usps}}

  JTBD Hunches:
  {{jtbdHunches}}

  Insights or Search Queries:
`,
});

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}


const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateInsightsPrompt(input);
    return output!;
  }
);
