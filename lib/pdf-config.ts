'use client';

import { pdfjs } from 'react-pdf';

// Fix for Next.js build issue with import.meta
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
