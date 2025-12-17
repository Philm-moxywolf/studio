import { config } from 'dotenv';
config();

import '@/ai/flows/generate-insights-from-knowledge-base.ts';
import '@/ai/flows/generate-report-from-agent-responses.ts';
import '@/ai/flows/extract-and-classify-user-signals.ts';