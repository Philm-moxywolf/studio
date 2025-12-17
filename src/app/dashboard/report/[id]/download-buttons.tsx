'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

type DownloadButtonsProps = {
  reportContent: string;
  reportTitle: string;
};

export default function DownloadButtons({ reportContent, reportTitle }: DownloadButtonsProps) {
  const handleDownloadMD = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/ /g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleDownloadMD}>
        <Download className="mr-2 h-4 w-4" />
        Download MD
      </Button>
      <Button onClick={handlePrintPDF}>
        <Printer className="mr-2 h-4 w-4" />
        Save as PDF
      </Button>
    </div>
  );
}
