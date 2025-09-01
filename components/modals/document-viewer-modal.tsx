'use client';

import { useState, useMemo } from 'react';
import '@/lib/pdf-config';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: 'image' | 'pdf';
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  documentUrl,
  documentType,
}: DocumentViewerModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.5);

  // Memoize the document file configuration to prevent unnecessary reloads
  const documentFile = useMemo(() => {
    if (documentType === 'pdf') {
      // Use proxy to bypass CORS restrictions
      return { url: `/api/download-proxy?url=${encodeURIComponent(documentUrl)}&disposition=inline` };
    }
    // For images, use proxy for CORS handling
    return `/api/download-proxy?url=${encodeURIComponent(documentUrl)}&disposition=inline`;
  }, [documentUrl, documentType]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= (numPages || 0) ? numPages || 0 : pageNumber + 1);

  if (!isOpen) return null;

  if (documentType === 'image') {
    return (
      <Lightbox
        open={isOpen}
        close={onClose}
        slides={[{ src: documentFile as string }]}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Document Viewer</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex flex-col">
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col items-center p-4">
              <Document
                file={documentFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Skeleton className="w-full h-[80vh]" />}
                error={
                  <div className="flex items-center justify-center w-full h-[80vh] text-red-500">
                    <p>Failed to load PDF document</p>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  width={Math.min(window.innerWidth * 0.8, 800)}
                />
              </Document>
            </div>
          </ScrollArea>
          {numPages && (
            <div className="flex items-center justify-center space-x-4 p-4 bg-background border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(scale - 0.1)}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(scale + 0.1)}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
