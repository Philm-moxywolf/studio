import type { Timestamp } from "firebase/firestore";

export type Report = {
  id: string;
  userId: string;
  title: string;
  inputs: {
    jtbdHunches: string;
    struggles: string;
    businessVertical: string;
    usps: string;
    knowledgeBase: string;
  };
  content: string;
  createdAt: Timestamp;
};
