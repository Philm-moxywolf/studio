'use server';

import { auth, db } from '@/lib/firebase';
import { generateReport } from '@/ai/flows/generate-report-from-agent-responses';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { redirect } from 'next/navigation';

type FormData = {
  jtbdHunches: string;
  struggles: string;
  businessVertical: string;
  usps: string;
  knowledgeBase: string;
};

export async function generateReportAction(formData: FormData, uid: string) {
  // In a real app with server-side auth, you would get the user from the session.
  // Since we use client-side auth, we trust the client has a logged-in user,
  // but we can't easily get the UID here without more setup.
  // For this demo, we'll proceed, but in production, secure this endpoint.
  // A simple way is to pass the user's UID from the client. Let's assume we do.
  
  try {
    const { jtbdHunches, struggles, businessVertical, usps, knowledgeBase } = formData;

    // This is a placeholder for the multi-agent search process.
    // In a complete application, you would have separate functions (agents)
    // that search Reddit, G2, blogs, etc., based on the input hunches.
    // Their outputs (user signals with sources) would be collected here.
    const mockedAgentResponses = [
      `Reddit User /u/dev_dude on r/SaaS: "I'm so tired of project management tools that don't have a proper public API. We waste so much time building brittle integrations." Source: https://www.reddit.com/r/SaaS/comments/example1`,
      `G2 Review for 'CompetitorApp': "The UI is clean, but the lack of real-time collaboration features is a dealbreaker for our distributed team. We're constantly overwriting each other's work." Source: https://www.g2.com/products/competitorapp/reviews/example1`,
      `TechCrunch Article 'The Future of Work is Collaborative': "Startups that fail to prioritize features like shared cursors, live commenting, and integrated video chat are being left behind in the post-pandemic SaaS landscape." Source: https://techcrunch.com/2023/10/26/the-future-of-work-is-collaborative/`,
      `Tweet from @ProductGal: "Why do so many B2B apps still have confusing version control? Just let me see a history of changes and revert easily. It's not that hard!" Source: https://twitter.com/ProductGal/status/example1`,
    ];

    // The 'governing agent' uses the collected signals to generate the final report.
    const reportResult = await generateReport({
      jtbdHunches,
      struggles,
      businessVertical,
      usps,
      knowledgeBase,
      agentResponses: mockedAgentResponses,
    });

    if (!uid) {
      return { error: 'Authentication required.' };
    }

    const reportDoc = {
      userId: uid,
      title: `Report for ${businessVertical} - ${new Date().toLocaleDateString()}`,
      inputs: formData,
      content: reportResult.report,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'reports'), reportDoc);

    return { reportId: docRef.id };
  } catch (error: any) {
    console.error('Error generating report:', error);
    return { error: error.message || 'Failed to generate report.' };
  }
}
