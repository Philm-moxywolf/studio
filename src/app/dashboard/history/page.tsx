import { Suspense } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { db } from '@/lib/firebase';
import type { Report } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, History, FileWarning } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// This is a workaround to get the user on the server.
// It's not fully secure and relies on the client being initialized.
// For production, a proper server-side session management (e.g., with Firebase Admin SDK) is recommended.
async function getReportsForCurrentUser(): Promise<Report[]> {
  if (getApps().length === 0) {
    // Firebase not initialized on the server for this render, cannot fetch data.
    return [];
  }
  
  // This is a hacky way to get user on server component, not for production
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return [];
  }

  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  const reports: Report[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    reports.push({
      id: doc.id,
      ...data,
      // Ensure createdAt is a serializable format if needed, but Firestore Timestamp is fine here
    } as Report);
  });
  
  return reports;
}

function ReportHistorySkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Vertical</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function ReportHistoryList() {
    const reports = await getReportsForCurrentUser();

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center p-12 h-80">
                <FileWarning className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Reports Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">You haven&apos;t generated any reports yet.</p>
                <Button asChild className="mt-6">
                    <Link href="/dashboard">Generate Your First Report</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Vertical</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{report.inputs.businessVertical}</Badge>
                </TableCell>
                <TableCell>{report.createdAt.toDate().toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/report/${report.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
}

export default function HistoryPage() {
  // By using headers(), we ensure this component is dynamically rendered.
  headers();
    
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Report History
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review your previously generated signal reports.
        </p>
      </header>
      <Card>
        <CardHeader>
             <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <History className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>Your Past Reports</CardTitle>
                    <CardDescription>A log of all your generated analyses.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<ReportHistorySkeleton />}>
                <ReportHistoryList />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
