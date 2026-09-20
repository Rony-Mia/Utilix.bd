import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  FileArchive,
  Layers,
  Settings,
  ShieldCheck,
  HelpCircle,
  RefreshCw,
  FileImage,
  Sparkles,
  X,
  Smartphone,
  Eye,
  Check
} from 'lucide-react';

export type OutputFormat = 'jpeg' | 'png' | 'webp';

export interface HeicFileItem {
  id: string;
  file: File;
  name: string;
  originalSizeBytes: number;
  status: 'pending' | 'converting' | 'completed' | 'error';
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSizeBytes?: number;
  convertedFileName?: string;
  errorMessage?: string;
}

// Helper to format file size cleanly
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Convert numbers to Bengali digits
function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => banglaDigits[Number(d)]);
}

// Check if a file is a valid HEIC / HEIF
function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === 'image/heic-sequence' ||
    type === 'image/heif-sequence'
  );
}

export const HeicConverterPage: React.FC = () => {
  // Output format & quality settings
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState<number>(85);

  // File queue state
  const [items, setItems] = useState<HeicFileItem[]>([]);
  const [isConvertingAll, setIsConvertingAll] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [skippedMessages, setSkippedMessages] = useState<string[]>([]);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewName, setActivePreviewName] = useState<string>('');

  const cancelConvertingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.convertedUrl) {
          URL.revokeObjectURL(item.convertedUrl);
        }
      });
    };
  }, [items]);

  // Handle incoming files (drag-drop or file selector)
  const processFileList = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const newItems: HeicFileItem[] = [];
    const skipped: string[] = [];

    filesArray.forEach((file) => {
      if (isHeicFile(file)) {
        newItems.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          originalSizeBytes: file.size,
          status: 'pending',
        });
      } else {
        skipped.push(`"${file.name}" — এই ফাইলটি HEIC/HEIF ফরম্যাটে নেই, স্কিপ করা হয়েছে`);
      }
    });

    if (skipped.length > 0) {
      setSkippedMessages((prev) => [...prev, ...skipped]);
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
      e.target.value = '';
    }
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.convertedUrl) {
        URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Clear all items
  const handleClearAll = () => {
    if (isConvertingAll) {
      cancelConvertingRef.current = true;
    }
    items.forEach((item) => {
      if (item.convertedUrl) {
        URL.revokeObjectURL(item.convertedUrl);
      }
    });
    setItems([]);
    setSkippedMessages([]);
  };

  // Load sample HEIC file for quick testing without iPhone
  const handleLoadSample = async () => {
    try {
      const response = await fetch('/sample.heic');
      if (!response.ok) throw new Error('নমুনা ফাইল লোড করা সম্ভব হয়নি');
      const blob = await response.blob();
      const sampleFile = new File([blob], 'iphone_camera_sample.heic', {
        type: 'image/heic',
      });
      processFileList([sampleFile]);
    } catch (err) {
      console.error('Failed to load sample HEIC:', err);
    }
  };

  // Process a single item
  const convertSingleItem = async (
    item: HeicFileItem,
    targetFormat: OutputFormat,
    targetQuality: number
  ): Promise<{
    status: 'completed' | 'error';
    convertedBlob?: Blob;
    convertedUrl?: string;
    convertedSizeBytes?: number;
    convertedFileName?: string;
    errorMessage?: string;
  }> => {
    try {
      // Dynamically import heic2any to keep initial bundle lightweight
      const heic2anyModule = await import('heic2any');
      const heic2any = (heic2anyModule.default || heic2anyModule) as (options: {
        blob: Blob;
        multiple?: boolean;
        toType?: string;
        quality?: number;
        gifInterval?: number;
      }) => Promise<Blob | Blob[]>;

      const mimeType =
        targetFormat === 'png'
          ? 'image/png'
          : targetFormat === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

      const qualityParam = targetFormat === 'png' ? undefined : targetQuality / 100;

      const result = await heic2any({
        blob: item.file,
        toType: mimeType,
        quality: qualityParam,
      });

      const singleBlob: Blob = Array.isArray(result) ? result[0] : result;
      const convertedUrl = URL.createObjectURL(singleBlob);

      const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const convertedFileName = `${baseName}.${extension}`;

      return {
        status: 'completed',
        convertedBlob: singleBlob,
        convertedUrl,
        convertedSizeBytes: singleBlob.size,
        convertedFileName,
      };
    } catch (err: unknown) {
      console.error(`Conversion error for ${item.name}:`, err);
      const message =
        err instanceof Error ? err.message : 'ফাইলটি রূপান্তর করতে সমস্যা হয়েছে';
      return {
        status: 'error',
        errorMessage: message,
      };
    }
  };

  // Batch convert all pending or error items
  const handleConvertAll = async () => {
    if (items.length === 0 || isConvertingAll) return;

    setIsConvertingAll(true);
    cancelConvertingRef.current = false;

    for (let i = 0; i < items.length; i++) {
      if (cancelConvertingRef.current) break;

      const currentItem = items[i];
      // Only convert items that are not already completed
      if (currentItem.status === 'completed') continue;

      // Mark this item as converting
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'converting', errorMessage: undefined } : item
        )
      );

      // Give browser brief tick to re-render status
      await new Promise((resolve) => setTimeout(resolve, 40));

      const result = await convertSingleItem(currentItem, outputFormat, quality);

      if (cancelConvertingRef.current) break;

      // Update state with result
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i
            ? {
                ...item,
                status: result.status,
                convertedBlob: result.convertedBlob,
                convertedUrl: result.convertedUrl,
                convertedSizeBytes: result.convertedSizeBytes,
                convertedFileName: result.convertedFileName,
                errorMessage: result.errorMessage,
              }
            : item
        )
      );
    }

    setIsConvertingAll(false);
  };

  // Convert an individual item if it had an error
  const handleRetrySingle = async (index: number) => {
    const currentItem = items[index];
    if (!currentItem) return;

    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, status: 'converting', errorMessage: undefined } : item
      )
    );

    const result = await convertSingleItem(currentItem, outputFormat, quality);

    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              status: result.status,
              convertedBlob: result.convertedBlob,
              convertedUrl: result.convertedUrl,
              convertedSizeBytes: result.convertedSizeBytes,
              convertedFileName: result.convertedFileName,
              errorMessage: result.errorMessage,
            }
          : item
      )
    );
  };

  // Download individual converted file
  const handleDownloadSingle = (item: HeicFileItem) => {
    if (!item.convertedUrl || !item.convertedFileName) return;
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = item.convertedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all completed files as a ZIP package
  const handleDownloadZip = async () => {
    const completedItems = items.filter(
      (item) => item.status === 'completed' && item.convertedBlob && item.convertedFileName
    );

    if (completedItems.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      // Dynamically import JSZip
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      const zip = new JSZip();

      // Handle identical filenames inside zip
      const usedNames: Record<string, number> = {};

      completedItems.forEach((item) => {
        let fileName = item.convertedFileName!;
        if (usedNames[fileName]) {
          const extIndex = fileName.lastIndexOf('.');
          const base = extIndex !== -1 ? fileName.substring(0, extIndex) : fileName;
          const ext = extIndex !== -1 ? fileName.substring(extIndex) : '';
          usedNames[fileName]++;
          fileName = `${base}_${usedNames[fileName]}${ext}`;
        } else {
          usedNames[fileName] = 1;
        }

        zip.file(fileName, item.convertedBlob!);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `Utilix-HEIC-Converted-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 15000);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Calculations & stats
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const convertingCount = items.filter((i) => i.status === 'converting').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Schema.org FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'HEIC ফরম্যাট কী, কেন আইফোনে এটা ব্যবহার হয়?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'HEIC (High Efficiency Image Container) হলো অ্যাপল কর্তৃক আইফোনে ব্যবহৃত একটি আধুনিক ইমেজ কম্প্রেশন ফরম্যাট। এটি প্রচলিত JPEG ছবির তুলনায় প্রায় অর্ধেক ফাইল সাইজে একই বা উন্নত ছবির মান প্রদান করে। ফলে আইফোনের মূল্যবান স্টোরেজ সাশ্রয় হয়। তবে অনেক উইন্ডোজ পিসি, পুরনো অ্যান্ড্রয়েড ফোন বা সরকারি অনলাইন পোর্টালে HEIC সরাসরি সমর্থন করে না।',
        },
      },
      {
        '@type': 'Question',
        name: 'একসাথে কতগুলো ছবি কনভার্ট করা যায়?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Utilix.bd-তে একসাথে যতগুলো ইচ্ছে ছবি আপলোড ও রূপান্তর করতে পারবেন। এখানে কোনো ফাইলের সংখ্যা বা সাইজের কৃত্রিম সীমাবদ্ধতা নেই। এটি সম্পূর্ণ বিনামূল্যে এবং আনলিমিটেড।',
        },
      },
      {
        '@type': 'Question',
        name: 'ছবির কোয়ালিটি কি কমে যায়?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'না। আপনার আইফোনের তোলা ছবির পূর্ণ রেজোলিউশন (Full Resolution) অক্ষুণ্ণ রাখা হয়। এছাড়া আপনি নিজের ইচ্ছামতো কোয়ালিটি স্লাইডার দিয়ে ৮০% থেকে ১০০% কোয়ালিটি নির্ধারণ করতে পারেন। আর PNG সিলেক্ট করলে এটি সম্পূর্ণ লসলেসভাবে (Lossless) রূপান্তরিত হয়।',
        },
      },
      {
        '@type': 'Question',
        name: 'ছবি কি কোথাও আপলোড বা সংরক্ষণ হয়?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'একদমই না! সম্পূর্ণ কনভার্শন প্রসেস আপনার নিজের ডিভাইসের ব্রাউজারে WebAssembly প্রযুক্তিতে সম্পন্ন হয়। আপনার কোনো ছবি বা ব্যক্তিগত ফাইল ইন্টারনেটে বা কোনো রিমোট সার্ভারে আপলোড হয় না। ফলে আপনার ব্যক্তিগত ও পারিবারিক ছবির গোপনীয়তা ১০০% নিশ্চিত থাকে।',
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>HEIC থেকে JPG/PNG কনভার্টার — আইফোন ছবি রূপান্তর | Utilix.bd</title>
        <meta
          name="description"
          content="আইফোনের HEIC ও HEIF ছবি সরাসরি ব্রাউজারে বিনামূল্যে JPG, PNG বা WebP-তে কনভার্ট করুন। ১০০% অফলাইন ও নিরাপদ ক্লায়েন্ট-সাইড প্রসেসিং, ব্যাচ কনভার্ট এবং ZIP ডাউনলোড।"
        />
        <meta
          property="og:title"
          content="HEIC থেকে JPG/PNG কনভার্টার — আইফোন ছবি রূপান্তর | Utilix.bd"
        />
        <meta
          property="og:description"
          content="আইফোনে তোলা HEIC ছবি সহজে রূপান্তর করুন JPG বা PNG ফরম্যাটে। সম্পূর্ণ ফ্রি, দ্রুত এবং কোনো ফাইল সার্ভারে আপলোড হয় না।"
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#d8cfb8] pb-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#083f2a] hover:text-[#0c5c3d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>টুলবক্সে ফিরে যান</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs text-[#0c5c3d] font-medium bg-[#f9f6ef] border border-[#d8cfb8] px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>১০০% অন-ডিভাইস কনভার্শন • প্রাইভেসি সুরক্ষিত</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#0c5c3d] text-[#fffdf7] font-bold rounded-none">
            আইফোন ফটো টুল
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#e5dec9] text-[#083f2a] font-bold rounded-none border border-[#d8cfb8]">
            ব্যাচ প্রসেসিং ও জিপ
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#083f2a] font-serif leading-tight">
          HEIC থেকে JPG/PNG কনভার্টার — আইফোনের ছবি সহজে রূপান্তর করুন
        </h1>
        <p className="text-sm text-[#4a4237] max-w-3xl leading-relaxed">
          আইফোনে তোলা ছবি ডিফল্টভাবে উচ্চ প্রযুক্তির <strong>HEIC</strong> ফরম্যাটে সেভ হয়, যেটা অনেক ওয়েবসাইট, সরকারি চাকরি পোর্টাল বা সাধারণ অ্যান্ড্রয়েড ডিভাইসে সরাসরি প্রদর্শিত হয় না। এখানে কোনো অ্যাপ ইনস্টল ছাড়াই আপনার আইফোনের একাধিক ছবি একসাথে <strong>JPG, PNG বা WebP</strong> ফরম্যাটে রূপান্তর করুন।
        </p>
      </div>

      {/* Skipped / Non-HEIC Notice Banner */}
      {skippedMessages.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>নন-HEIC ফাইল স্কিপ করা হয়েছে ({toBanglaNum(skippedMessages.length)}টি ফাইল)</span>
            </div>
            <button
              type="button"
              onClick={() => setSkippedMessages([])}
              className="text-amber-800 hover:text-amber-950 text-xs flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>মুছুন</span>
            </button>
          </div>
          <ul className="text-xs text-amber-800 list-disc list-inside space-y-1 pl-1">
            {skippedMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Settings & Configuration Card */}
      <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#d8cfb8] pb-3">
          <div className="flex items-center space-x-2 text-[#083f2a]">
            <Settings className="w-4 h-4 text-[#0c5c3d]" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-serif">
              কনভার্শন সেটিংস (Output Settings)
            </h2>
          </div>
          <span className="text-xs text-[#6b6255] font-mono">
            ডিফল্ট: JPG (৮৫% কোয়ালিটি)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#083f2a] block">
              আউটপুট ফরম্যাট নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOutputFormat('jpeg')}
                className={`py-2.5 px-3 border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  outputFormat === 'jpeg'
                    ? 'border-[#0c5c3d] bg-[#0c5c3d] text-[#fffdf7] shadow-sm'
                    : 'border-[#d8cfb8] bg-[#f9f6ef] text-[#4a4237] hover:border-[#0c5c3d]/60'
                }`}
              >
                <span className="font-bold text-sm">JPG</span>
                <span className={`text-[10px] ${outputFormat === 'jpeg' ? 'text-white/80' : 'text-[#6b6255]'}`}>
                  সর্বাধিক সামঞ্জস্যপূর্ণ
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOutputFormat('png')}
                className={`py-2.5 px-3 border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  outputFormat === 'png'
                    ? 'border-[#0c5c3d] bg-[#0c5c3d] text-[#fffdf7] shadow-sm'
                    : 'border-[#d8cfb8] bg-[#f9f6ef] text-[#4a4237] hover:border-[#0c5c3d]/60'
                }`}
              >
                <span className="font-bold text-sm">PNG</span>
                <span className={`text-[10px] ${outputFormat === 'png' ? 'text-white/80' : 'text-[#6b6255]'}`}>
                  লসলেস কোয়ালিটি
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOutputFormat('webp')}
                className={`py-2.5 px-3 border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  outputFormat === 'webp'
                    ? 'border-[#0c5c3d] bg-[#0c5c3d] text-[#fffdf7] shadow-sm'
                    : 'border-[#d8cfb8] bg-[#f9f6ef] text-[#4a4237] hover:border-[#0c5c3d]/60'
                }`}
              >
                <span className="font-bold text-sm">WebP</span>
                <span className={`text-[10px] ${outputFormat === 'webp' ? 'text-white/80' : 'text-[#6b6255]'}`}>
                  আধুনিক হালকা ওয়েব
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#6b6255] pt-0.5">
              {outputFormat === 'jpeg' &&
                'পাসপোর্ট, সরকারি আবেদন বা যেকোনো প্ল্যাটফর্মে আপলোডের জন্য JPG সবচেয়ে নিরাপদ পছন্দ।'}
              {outputFormat === 'png' &&
                'PNG একটি লসলেস ফরম্যাট—ছবির ডিটেইল ও রঙের কোনো কম্প্রেস হয় না।'}
              {outputFormat === 'webp' &&
                'ওয়েবসাইটে ব্যবহার ও দ্রুত লোডিংয়ের জন্য অত্যন্ত কম সাইজের আধুনিক ফরম্যাট।'}
            </p>
          </div>

          {/* Quality Slider (JPG & WebP) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#083f2a]">
                ছবির কোয়ালিটি (Image Quality):
              </label>
              <span className="text-xs font-mono font-bold text-[#0c5c3d] bg-[#f9f6ef] border border-[#d8cfb8] px-2 py-0.5">
                {outputFormat === 'png' ? '১০০% (Lossless)' : `${toBanglaNum(quality)}%`}
              </span>
            </div>

            {outputFormat === 'png' ? (
              <div className="p-3 bg-[#f9f6ef] border border-[#d8cfb8] text-xs text-[#6b6255] flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0c5c3d] shrink-0" />
                <span>পিএনজি একটি লসলেস ফরম্যাট, তাই এখানে ছবির সম্পূর্ণ কোয়ালিটি ১০০% সংরক্ষিত থাকে।</span>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#0c5c3d] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-[#6b6255]">
                  <span>ছোট সাইজ (৩০%)</span>
                  <span className="font-semibold text-[#083f2a]">সুপারিশকৃত: ৮৫%</span>
                  <span>সর্বোচ্চ ডিটেইল (১০০%)</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-[#6b6255]">
              ৮৫% কোয়ালিটিতে ফাইলের সাইজ অনেক কমে আসে অথচ খালি চোখে ছবির স্পষ্টতায় কোনো পার্থক্য বোঝা যায় না।
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-[#0c5c3d] bg-[#0c5c3d]/5 scale-[0.99]'
            : 'border-[#d8cfb8] bg-[#fffdf7] hover:border-[#0c5c3d]/70'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept=".heic,.heif,image/heic,image/heif"
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-none bg-[#f4efe4] border border-[#d8cfb8] flex items-center justify-center text-[#0c5c3d]">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-[#083f2a] font-serif">
              আইফোনের HEIC বা HEIF ছবি এখানে টেনে আনুন বা ক্লিক করুন
            </h2>
            <p className="text-xs text-[#6b6255]">
              একসাথে একাধিক (Multi-select) ছবি নির্বাচন করতে পারেন। কোনো লিমিট নেই।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center space-x-1 text-[11px] bg-[#f9f6ef] border border-[#d8cfb8] px-2.5 py-1 text-[#4a4237]">
              <Smartphone className="w-3 h-3 text-[#0c5c3d]" />
              <span>আইফোন .heic / .heif</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] bg-[#f9f6ef] border border-[#d8cfb8] px-2.5 py-1 text-[#4a4237]">
              <Layers className="w-3 h-3 text-[#0c5c3d]" />
              <span>আনলিমিটেড ফাইল ব্যাচ</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[11px] bg-[#f9f6ef] border border-[#d8cfb8] px-2.5 py-1 text-[#4a4237]">
              <ShieldCheck className="w-3 h-3 text-[#0c5c3d]" />
              <span>১০০% প্রাইভেট ও অফলাইন</span>
            </span>
          </div>

          {/* Quick Sample Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-[#0c5c3d] hover:text-[#083f2a] font-medium underline underline-offset-4 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>আইফোন ফাইল নেই? নমুনা HEIC ছবি দিয়ে পরীক্ষা করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Action Toolbar & Stats */}
      {items.length > 0 && (
        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-[#083f2a] font-serif text-sm">
                মোট ছবি: {toBanglaNum(totalCount)}টি
              </span>
              <span className="text-[#d8cfb8]">|</span>
              <span className="text-emerald-700 font-medium">
                সম্পন্ন: {toBanglaNum(completedCount)}
              </span>
              <span className="text-[#6b6255]">
                অপেক্ষমান: {toBanglaNum(pendingCount)}
              </span>
              {convertingCount > 0 && (
                <span className="text-[#0c5c3d] font-bold animate-pulse">
                  কনভার্ট হচ্ছে: {toBanglaNum(convertingCount)}
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600 font-medium">
                  এরর: {toBanglaNum(errorCount)}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Convert All Button */}
              {pendingCount > 0 || errorCount > 0 ? (
                <button
                  type="button"
                  onClick={handleConvertAll}
                  disabled={isConvertingAll}
                  className="bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] px-4 py-2 text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isConvertingAll ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>কনভার্ট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>সব কনভার্ট করুন ({toBanglaNum(pendingCount + errorCount)})</span>
                    </>
                  )}
                </button>
              ) : null}

              {/* Download All as ZIP Button */}
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="bg-[#083f2a] hover:bg-[#0c5c3d] text-[#fffdf7] px-4 py-2 text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isZipping ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>জিপ তৈরি হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <FileArchive className="w-3.5 h-3.5" />
                      <span>সব ডাউনলোড করুন (ZIP)</span>
                    </>
                  )}
                </button>
              )}

              {/* Clear All */}
              <button
                type="button"
                onClick={handleClearAll}
                className="border border-[#d8cfb8] bg-[#f9f6ef] hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-[#6b6255] px-3 py-2 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব মুছুন</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#6b6255]">
                <span>কনভার্শন অগ্রগতি</span>
                <span className="font-mono font-semibold text-[#083f2a]">
                  {toBanglaNum(completedCount)} / {toBanglaNum(totalCount)} টি সম্পন্ন ({toBanglaNum(progressPercent)}%)
                </span>
              </div>
              <div className="w-full bg-[#f4efe4] h-2 border border-[#d8cfb8] overflow-hidden">
                <div
                  className="bg-[#0c5c3d] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Files Grid */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#083f2a] font-serif uppercase tracking-wider">
              ছবির তালিকা ({toBanglaNum(items.length)}টি ফাইল)
            </h2>
            <span className="text-xs text-[#6b6255]">
              আউটপুট: <strong className="text-[#083f2a] uppercase">{outputFormat}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={`bg-[#fffdf7] border p-3 flex flex-col justify-between space-y-3 transition-all ${
                    item.status === 'completed'
                      ? 'border-[#0c5c3d]/60 shadow-sm'
                      : item.status === 'error'
                      ? 'border-red-400 bg-red-50/20'
                      : item.status === 'converting'
                      ? 'border-[#0c5c3d] ring-1 ring-[#0c5c3d]/30'
                      : 'border-[#d8cfb8]'
                  }`}
                >
                  {/* Thumbnail & Preview */}
                  <div className="relative aspect-[4/3] bg-[#f4efe4] border border-[#d8cfb8]/70 flex items-center justify-center overflow-hidden group">
                    {item.status === 'completed' && item.convertedUrl ? (
                      <>
                        <img
                          src={item.convertedUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActivePreviewUrl(item.convertedUrl!);
                            setActivePreviewName(item.convertedFileName || item.name);
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-1 text-xs cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>প্রিভিউ দেখুন</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1.5 p-3 text-center">
                        <Smartphone className="w-7 h-7 text-[#0c5c3d]/70" />
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-[#e5dec9] text-[#083f2a] px-1.5 py-0.5 border border-[#d8cfb8]">
                          আইফোন HEIC
                        </span>
                        <span className="text-[10px] text-[#6b6255]">
                          কনভার্ট হলে থাম্বনেইল দেখা যাবে
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] bg-[#f9f6ef]/90 backdrop-blur-xs text-[#6b6255] border border-[#d8cfb8] px-1.5 py-0.5 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>অপেক্ষমান</span>
                        </span>
                      )}
                      {item.status === 'converting' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] bg-[#0c5c3d] text-[#fffdf7] px-2 py-0.5 font-bold shadow-xs">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>কনভার্ট হচ্ছে...</span>
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-700 text-[#fffdf7] px-1.5 py-0.5 font-bold shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>সম্পন্ন</span>
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] bg-red-600 text-white px-1.5 py-0.5 font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span>ব্যর্থ</span>
                        </span>
                      )}
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-700 text-white p-1 transition-colors cursor-pointer"
                      title="ছবি মুছুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metadata & Status */}
                  <div className="space-y-1.5 text-xs">
                    <div
                      className="font-semibold text-[#083f2a] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6b6255] font-mono">
                      <span>আসল: {formatSize(item.originalSizeBytes)}</span>
                      <span className="uppercase text-[10px] px-1 bg-[#f4efe4] border border-[#d8cfb8]">
                        HEIC
                      </span>
                    </div>

                    {/* Converted Stats */}
                    {item.status === 'completed' && item.convertedSizeBytes && (
                      <div className="pt-1.5 border-t border-[#d8cfb8]/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#0c5c3d] font-bold">
                          নতুন: {formatSize(item.convertedSizeBytes)}
                        </span>
                        <span className="uppercase text-[10px] font-bold text-[#083f2a]">
                          {outputFormat}
                        </span>
                      </div>
                    )}

                    {/* Error message */}
                    {item.status === 'error' && (
                      <div className="pt-1 border-t border-red-200">
                        <p className="text-[11px] text-red-600 leading-tight">
                          {item.errorMessage || 'প্রসেসিং ব্যর্থ'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRetrySingle(index)}
                          className="mt-1 text-[11px] text-[#0c5c3d] hover:underline font-medium flex items-center space-x-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>আবার চেষ্টা করুন</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Individual Download Button */}
                  {item.status === 'completed' && item.convertedUrl && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="w-full mt-1 border border-[#0c5c3d] bg-[#f4efe4] hover:bg-[#0c5c3d] hover:text-[#fffdf7] text-[#083f2a] py-1.5 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড ({outputFormat.toUpperCase()})</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Converted Preview */}
      {activePreviewUrl && (
        <div
          onClick={() => setActivePreviewUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fffdf7] border border-[#d8cfb8] max-w-3xl w-full p-4 relative space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#d8cfb8] pb-2">
              <span className="text-xs font-bold text-[#083f2a] truncate max-w-md">
                {activePreviewName}
              </span>
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="text-[#6b6255] hover:text-[#083f2a] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center overflow-auto bg-[#f4efe4] p-2">
              <img
                src={activePreviewUrl}
                alt={activePreviewName}
                className="max-h-[65vh] w-auto object-contain shadow-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <a
                href={activePreviewUrl}
                download={activePreviewName}
                className="bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] px-4 py-1.5 text-xs font-bold inline-flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড করুন</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Instructions & Features Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[#0c5c3d]">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-bold text-xs sm:text-sm font-serif text-[#083f2a]">
              আইফোনের আসল রেজোলিউশন
            </h3>
          </div>
          <p className="text-xs text-[#6b6255] leading-relaxed">
            ক্যামেরার উচ্চ মান এবং কালার প্রোফাইল অক্ষুণ্ণ রেখে ছবিগুলো কনভার্ট করা হয়। কোনো ব্লার বা অপ্রয়োজনীয় ক্রপ হয় না।
          </p>
        </div>

        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[#0c5c3d]">
            <FileArchive className="w-5 h-5" />
            <h3 className="font-bold text-xs sm:text-sm font-serif text-[#083f2a]">
              এক ক্লিকে ZIP ডাউনলোড
            </h3>
          </div>
          <p className="text-xs text-[#6b6255] leading-relaxed">
            একাধিক ছবি থাকলে প্রতিটি আলাদা ডাউনলোড করার ঝামেলা ছাড়াই সবগুলো ছবি একসাথে গোছানো জিপ প্যাকেজে নামিয়ে নিতে পারবেন।
          </p>
        </div>

        <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 space-y-2">
          <div className="flex items-center space-x-2 text-[#0c5c3d]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-xs sm:text-sm font-serif text-[#083f2a]">
              গোপনীয়তা ও অফলাইন সুবিধা
            </h3>
          </div>
          <p className="text-xs text-[#6b6255] leading-relaxed">
            কোনো ফাইল ইন্টারনেটে আপলোড হয় না। সম্পূর্ণ কনভার্শন আপনার ব্রাউজারের ভেতর মেমোরিতে নিরাপদে সম্পন্ন হয়।
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#fffdf7] border border-[#d8cfb8] p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#d8cfb8] pb-3">
          <HelpCircle className="w-4 h-4 text-[#0c5c3d]" />
          <h2 className="text-base font-bold text-[#083f2a] font-serif">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h2>
        </div>

        <div className="divide-y divide-[#d8cfb8] text-xs sm:text-sm text-[#4a4237]">
          <div className="py-3.5 space-y-1">
            <h3 className="font-semibold text-[#083f2a]">
              HEIC ফরম্যাট কী, কেন আইফোনে এটা ব্যবহার হয়?
            </h3>
            <p className="text-[#6b6255] leading-relaxed">
              HEIC (High Efficiency Image Container) হলো অ্যাপল কর্তৃক আইফোনে ব্যবহৃত একটি আধুনিক ইমেজ কম্প্রেশন ফরম্যাট। এটি প্রচলিত JPEG ছবির তুলনায় প্রায় অর্ধেক ফাইল সাইজে একই বা উন্নত ছবির মান প্রদান করে। ফলে আইফোনের মূল্যবান স্টোরেজ সাশ্রয় হয়। তবে অনেক উইন্ডোজ পিসি, পুরনো অ্যান্ড্রয়েড ফোন বা সরকারি অনলাইন পোর্টালে HEIC সরাসরি সমর্থন করে না বিধায় এটিকে JPG/PNG-তে রূপান্তর করার প্রয়োজন হয়।
            </p>
          </div>

          <div className="py-3.5 space-y-1">
            <h3 className="font-semibold text-[#083f2a]">
              একসাথে কতগুলো ছবি কনভার্ট করা যায়?
            </h3>
            <p className="text-[#6b6255] leading-relaxed">
              একসাথে যতগুলো ইচ্ছে ছবি আপলোড ও রূপান্তর করতে পারবেন। এখানে কোনো ফাইলের সংখ্যা বা সাইজের কৃত্রিম সীমাবদ্ধতা নেই। এটি সম্পূর্ণ আনলিমিটেড এবং ফ্রি।
            </p>
          </div>

          <div className="py-3.5 space-y-1">
            <h3 className="font-semibold text-[#083f2a]">
              ছবির কোয়ালিটি কি কমে যায়?
            </h3>
            <p className="text-[#6b6255] leading-relaxed">
              না। আপনার আইফোনে তোলা ছবির মূল রেজোলিউশন সম্পূর্ণ অক্ষুণ্ণ রাখা হয়। এছাড়া আপনি নিজের ইচ্ছামতো কোয়ালিটি স্লাইডার দিয়ে ৮০% থেকে ১০০% কোয়ালিটি নির্ধারণ করতে পারেন। আর PNG ফরম্যাট নির্বাচন করলে এটি সম্পূর্ণ লসলেসভাবে (Lossless) রূপান্তরিত হয়।
            </p>
          </div>

          <div className="py-3.5 space-y-1">
            <h3 className="font-semibold text-[#083f2a]">
              ছবি কি কোথাও আপলোড বা সংরক্ষণ হয়?
            </h3>
            <p className="text-[#6b6255] leading-relaxed">
              একদমই না! সম্পূর্ণ কনভার্শন প্রসেস আপনার ডিভাইসের ব্রাউজারে WebAssembly প্রযুক্তিতে সম্পন্ন হয়। আপনার কোনো ছবি বা ব্যক্তিগত ফাইল ইন্টারনেটে বা কোনো রিমোট সার্ভারে আপলোড হয় না। ফলে আপনার ব্যক্তিগত ও পারিবারিক ছবির গোপনীয়তা ১০০% সুরক্ষিত থাকে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
