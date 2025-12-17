'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, FileText, Lightbulb, Puzzle, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/icons';
import { generateReportAction } from '@/lib/actions';
import { useUser } from '@/firebase';

const formSchema = z.object({
  jtbdHunches: z.string().min(10, { message: 'Please provide some detail about your JTBD hunches.' }),
  struggles: z.string().min(10, { message: 'Please describe the struggles in some detail.' }),
  businessVertical: z.string().min(2, { message: 'Business vertical is required.' }),
  usps: z.string().min(10, { message: 'Please describe your USPs in some detail.' }),
  knowledgeBase: z.string().min(20, { message: 'Please provide a sufficient knowledge base.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jtbdHunches: '',
      struggles: '',
      businessVertical: '',
      usps: '',
      knowledgeBase: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to generate a report.',
        });
        return;
    }
    setIsLoading(true);
    toast({
      title: 'Generating Report...',
      description: 'The AI agents are on the hunt. This may take a few moments.',
    });
    
    try {
      const result = await generateReportAction(data, user.uid);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Report Generated!',
        description: 'Your report is ready for viewing.',
      });
      router.push(`/dashboard/report/${result.reportId}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: error.message || 'An unknown error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Hunt for New Signals
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fill in the details below to deploy AI agents and uncover market signals.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Analysis Configuration</CardTitle>
              <CardDescription>Provide context for the AI agents.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="jtbdHunches"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> JTBD Hunches</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="e.g., 'Users want to collaborate on documents in real-time without context switching.'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="struggles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Puzzle className="h-4 w-4" /> User Struggles</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="e.g., 'Version control is a nightmare, constantly emailing files back and forth.'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-8">
                   <FormField
                    control={form.control}
                    name="businessVertical"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Target className="h-4 w-4" /> Business Vertical</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'SaaS for Project Management'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4" /> Unique Selling Propositions (USPs)</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="e.g., 'Our AI-powered task prioritization saves teams 10 hours a week.'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="knowledgeBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4" /> Company Knowledge Base</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="Paste your company's 'About Us' page, mission, vision, and key product descriptions." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading && <Loader className="mr-2" />}
                  Generate Report
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
