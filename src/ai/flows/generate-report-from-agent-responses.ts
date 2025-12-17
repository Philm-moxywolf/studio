'use server';

/**
 * @fileOverview Generates a final report by ingesting agent responses from the vector store.
 *
 * - generateReport - A function that generates the final report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  jtbdHunches: z.string().describe('Job to be Done hunches.'),
  struggles: z.string().describe('Problems job executors are dealing with.'),
  businessVertical: z.string().describe('The business vertical.'),
  usps: z.string().describe('Unique selling propositions.'),
  knowledgeBase: z
    .string()
    .describe('Company information knowledge base.'),
  agentResponses: z
    .array(z.string())
    .describe('Agent responses from various platforms.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The final report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  model: 'gemini-3-pro-preview',
  prompt: `You are an expert report generator. You will receive information about JTBD hunches, struggles, business vertical, USP's, a company knowledge base, and agent responses from various platforms.

  Your goal is to create a final report that includes all of the information and ensures that all URLs and citations are correctly linked and coherent.

  JTBD Hunch: {{{jtbdHunches}}}
  Struggles: {{{struggles}}}
  Business Vertical: {{{businessVertical}}}
  USPs: {{{usps}}}
  Knowledge Base: {{{knowledgeBase}}}
  Agent Responses: {{{agentResponses}}}

  Final Report: `,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
