'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { KycVerification } from '@/types/api';
import { downloadFile } from '@/lib/utils';
import { DocumentViewerModal } from '@/components/modals/document-viewer-modal';

interface DocumentButtonsProps {
  verification: KycVerification;
}

export function DocumentButtons({ verification }: DocumentButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentType, setDocumentType] = useState<'image' | 'pdf'>('image');

  const getFileExtension = (url: string) => {
    try {
      return new URL(url).pathname.split('.').pop()?.toLowerCase() || '';
    } catch {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const getDocumentType = (url: string): 'image' | 'pdf' => {
    const extension = getFileExtension(url);
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'image'; // Default to image, though a more robust solution might handle more types
  };

  const handleViewDocument = (url: string) => {
    setDocumentUrl(url);
    setDocumentType(getDocumentType(url));
    setIsModalOpen(true);
  };

  const renderDocumentButtons = (url: string | null | undefined, docTypeLabel: string) => {
    if (!url) return null;

    const filename = `${verification.user.full_name.replace(
      /\s+/g,
      '_',
    )}_${docTypeLabel}.${getFileExtension(url)}`;

    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium capitalize w-32">
          {docTypeLabel.replace(/_/g, ' ')}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDocument(url)}
          title={`View ${docTypeLabel}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadFile(url, filename)}
          title={`Download ${docTypeLabel}`}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        {renderDocumentButtons(
          verification.utility_bill_full_url,
          'utility_bill',
        )}
        {renderDocumentButtons(
          verification.bank_statement_full_url,
          'bank_statement',
        )}
        {renderDocumentButtons(
          verification.cac_document_full_url,
          'cac_document',
        )}
      </div>

      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentUrl={documentUrl}
        documentType={documentType}
      />
    </>
  );
}
