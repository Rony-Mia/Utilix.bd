import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';

export interface LoadedPdfInfo {
  doc: PDFDocument;
  buffer: ArrayBuffer;
  name: string;
  pageCount: number;
  sizeBytes: number;
}

/**
 * Load a PDFDocument from a browser File with robust error handling.
 * Checks for encrypted/password-protected PDFs and corrupted files.
 */
export async function loadPdf(file: File): Promise<PDFDocument> {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith('.pdf') && file.type !== 'application/pdf') {
    throw new Error(`"${file.name}": এটি একটি বৈধ পিডিএফ ফাইল নয়। শুধুমাত্র .pdf ফাইল যোগ করুন।`);
  }

  const buffer = await file.arrayBuffer();
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    return pdfDoc;
  } catch (err: unknown) {
    const errStr = String(err).toLowerCase();
    const errName = (err as { name?: string })?.name?.toLowerCase() || '';
    if (
      errName.includes('password') ||
      errStr.includes('password') ||
      errStr.includes('encrypted') ||
      errStr.includes('decrypt')
    ) {
      throw new Error(
        `"${file.name}": পাসওয়ার্ড-সুরক্ষিত পিডিএফ এখনো সাপোর্টেড না। অনুগ্রহ করে সুরক্ষা অপসারণ করে ফাইলটি দিন।`
      );
    }
    throw new Error(
      `"${file.name}": ফাইলটি ক্ষতিগ্রস্ত বা অবৈধ পিডিএফ (করাপ্টেড)। অনুগ্রহ করে সঠিক ফাইল যোগ করুন।`
    );
  }
}

/**
 * Loads a PDF file and returns complete metadata along with doc & buffer.
 */
export async function getPdfInfo(file: File): Promise<LoadedPdfInfo> {
  const buffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
  } catch (err: unknown) {
    const errStr = String(err).toLowerCase();
    const errName = (err as { name?: string })?.name?.toLowerCase() || '';
    if (
      errName.includes('password') ||
      errStr.includes('password') ||
      errStr.includes('encrypted') ||
      errStr.includes('decrypt')
    ) {
      throw new Error(
        `"${file.name}": পাসওয়ার্ড-সুরক্ষিত পিডিএফ এখনো সাপোর্টেড না। অনুগ্রহ করে সুরক্ষা অপসারণ করে ফাইলটি দিন।`
      );
    }
    throw new Error(
      `"${file.name}": ফাইলটি ক্ষতিগ্রস্ত বা অবৈধ পিডিএফ (করাপ্টেড)। অনুগ্রহ করে সঠিক ফাইল যোগ করুন।`
    );
  }

  const pageCount = doc.getPageCount();
  return {
    doc,
    buffer,
    name: file.name,
    pageCount,
    sizeBytes: file.size,
  };
}

/**
 * Trigger client-side download of a PDFDocument without server transmission.
 */
export async function downloadPdfBlob(pdfDoc: PDFDocument, filename: string): Promise<void> {
  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Trigger client-side download from a raw Uint8Array PDF.
 */
export function downloadRawPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Trigger client-side download of a ZIP file using JSZip.
 */
export async function downloadZipBlob(zip: JSZip, filename: string): Promise<void> {
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Convert Bengali digits into English standard digits.
 */
export function normalizeBanglaDigits(input: string): string {
  const banglaToEnglishMap: Record<string, string> = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
  };
  return input.replace(/[০-৯]/g, (d) => banglaToEnglishMap[d] ?? d);
}

/**
 * Parses user range strings (e.g. "1-3, 5, 7-9" or "১-৩, ৫, ৭-৯")
 * Returns array of 0-based page indices lists, one per range group.
 */
export function parsePageRangeString(
  rangeStr: string,
  totalPageCount: number
): { ranges: number[][]; invalidTokens: string[] } {
  const normalized = normalizeBanglaDigits(rangeStr);
  const tokens = normalized.split(/[,;\n]+/).map((t) => t.trim()).filter(Boolean);
  const ranges: number[][] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const pageNum = parseInt(token, 10);
      if (pageNum >= 1 && pageNum <= totalPageCount) {
        ranges.push([pageNum - 1]);
      } else {
        invalidTokens.push(token);
      }
    } else if (/^\d+\s*-\s*\d+$/.test(token)) {
      const parts = token.split('-').map((p) => parseInt(p.trim(), 10));
      const start = Math.min(parts[0], parts[1]);
      const end = Math.max(parts[0], parts[1]);

      if (start >= 1 && end <= totalPageCount) {
        const group: number[] = [];
        for (let p = start; p <= end; p++) {
          group.push(p - 1);
        }
        ranges.push(group);
      } else {
        invalidTokens.push(token);
      }
    } else {
      invalidTokens.push(token);
    }
  }

  return { ranges, invalidTokens };
}

/**
 * Extract specific pages into a new PDFDocument.
 * pageIndices are 0-based.
 */
export async function extractPages(
  sourceDoc: PDFDocument,
  pageIndices: number[]
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();
  const validIndices = pageIndices.filter((idx) => idx >= 0 && idx < sourceDoc.getPageCount());
  if (validIndices.length === 0) {
    throw new Error('কোনো বৈধ পেজ পাওয়া যায়নি।');
  }
  const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }
  return newDoc;
}

/**
 * Delete specified page indices from a source PDF and return a new PDFDocument.
 * pageIndicesToDelete are 0-based.
 */
export async function deletePages(
  sourceDoc: PDFDocument,
  pageIndicesToDelete: number[]
): Promise<PDFDocument> {
  const total = sourceDoc.getPageCount();
  const deleteSet = new Set(pageIndicesToDelete);
  const remainingIndices: number[] = [];

  for (let i = 0; i < total; i++) {
    if (!deleteSet.has(i)) {
      remainingIndices.push(i);
    }
  }

  if (remainingIndices.length === 0) {
    throw new Error('সবগুলো পেজ মুছে ফেলা যাবে না। কমপক্ষে একটি পেজ অবশ্যই রাখতে হবে।');
  }

  return extractPages(sourceDoc, remainingIndices);
}

/**
 * Rotate specific pages or all pages by given degrees.
 * rotationMap: map of 0-based page index to rotation delta in degrees (e.g. +90, -90, 180).
 */
export async function rotatePages(
  sourceDoc: PDFDocument,
  rotationMap: Map<number, number>
): Promise<PDFDocument> {
  // We can modify the sourceDoc or copy it
  const pageCount = sourceDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const delta = rotationMap.get(i);
    if (delta && delta !== 0) {
      const page = sourceDoc.getPage(i);
      const currentRotation = page.getRotation().angle;
      const newAngle = (currentRotation + delta) % 360;
      const normalizedAngle = (newAngle + 360) % 360;
      page.setRotation(degrees(normalizedAngle));
    }
  }
  return sourceDoc;
}

/**
 * Format bytes to readable string in Bengali.
 */
export function formatBytesBengali(bytes: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (val: number | string) => String(val).replace(/\d/g, (d) => banglaDigits[Number(d)]);

  if (bytes < 1024) return `${toBn(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${toBn(kb.toFixed(1))} KB`;
  const mb = kb / 1024;
  return `${toBn(mb.toFixed(2))} MB`;
}
