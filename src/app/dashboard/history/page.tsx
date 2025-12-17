'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';

import { useFirestore, useUser, useMemoFirebase, useCollection, WithId } from '@/firebase';
import type { Report as ReportType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, History, FileWarning } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


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

function ReportHistoryList() {
    const firestore = useFirestore();
    const { user } = useUser();

    const reportsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'reports'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: reports, isLoading } = useCollection<ReportType>(reportsQuery);

    if (isLoading) {
      return <ReportHistorySkeleton />;
    }

    if (!reports || reports.length === 0) {
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
                <TableCell>{(report.createdAt as Timestamp)?.toDate().toLocaleDateString()}</TableCell>
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
