'use server';

/**
 * @fileOverview Generates a final report by ingesting agent responses.
 *
 * - generateReport - A function that generates the final report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Define Schemas
const GenerateReportInputSchema = z.object({
  jtbdHunches: z.string().describe('Job to be Done hunches.'),
  struggles: z.string().describe('Problems job executors are dealing with.'),
  businessVertical: z.string().describe('The business vertical.'),
  usps: z.string().describe('Unique selling propositions.'),
  knowledgeBase: z.string().describe('Company information knowledge base.'),
  agentResponses: z.array(z.string()).describe('Agent responses from various platforms.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The final report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;


// 2. Define the Prompt GLOBALLY
// This prevents the "Prompt already registered" error
const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  // We use the default model from src/ai/genkit.ts
  prompt: `You are an expert report generator.

Analyze the following data:

Business Vertical: {{businessVertical}}
USPs: {{usps}}
Knowledge Base: {{knowledgeBase}}

JTBD Hunches: {{jtbdHunches}}
Struggles: {{struggles}}

Agent Responses:
{{#each agentResponses}}
- {{this}}
{{/each}}

Create a final report that synthesizes this information. Ensure all citations are coherent.
`,
});


// 3. Define the Flow
const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    // 4. Call the prompt
    const response = await generateReportPrompt(input);
    const reportText = response.text();

    if (!reportText) {
      throw new Error('AI model returned empty response.');
    }

    return {
      report: reportText,
    };
  }
);

// 4. Define the exported function for the server action
export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}
