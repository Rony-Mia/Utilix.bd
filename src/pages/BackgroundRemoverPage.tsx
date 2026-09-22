import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Upload,
  Download,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileImage,
  Layers,
  Sliders,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Palette
} from 'lucide-react';
import { RelatedTools } from '../components/RelatedTools.tsx';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 20;

interface ColorPreset {
  name: string;
  value: string;
  border?: boolean;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'ট্রান্সপারেন্ট', value: 'transparent' },
  { name: 'সাদা', value: '#ffffff', border: true },
  { name: 'পাসপোর্ট স্কাই ব্লু', value: '#d6e6f2' },
  { name: 'অফিসিয়াল ব্লু', value: '#2563eb' },
  { name: 'হালকা ধূসর', value: '#f3f4f6' },
  { name: 'গাঢ় সবুজ', value: '#083f2a' },
  { name: 'গাঢ় নীল', value: '#1e3a8a' },
  { name: 'কালো', value: '#111827' }
];

export const BackgroundRemoverPage: React.FC = () => {
  // State for image inputs
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Result state
  const [removedImageBlob, setRemovedImageBlob] = useState<Blob | null>(null);
  const [removedImageUrl, setRemovedImageUrl] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Background color customization
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [customColor, setCustomColor] = useState<string>('#ffffff');

  // View mode & comparison slider
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'result'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Download export format
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  // Drag & drop state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (removedImageUrl) {
        URL.revokeObjectURL(removedImageUrl);
      }
    };
  }, [removedImageUrl]);

  // Handle Before/After slider dragging
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingSlider || !e.touches[0]) return;
      handleSliderMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider) return;
      handleSliderMove(e.clientX);
    };

    const handleMouseUp = () => {
      if (isDraggingSlider) {
        setIsDraggingSlider(false);
      }
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider, handleSliderMove]);

  // Main Background Removal Logic using dynamic import
  const processImageFile = async (file: File | Blob, displayName: string) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus('AI ইঞ্জিন ও লাইব্রেরি লোড হচ্ছে...');

    // Release previous result URL
    if (removedImageUrl) {
      URL.revokeObjectURL(removedImageUrl);
      setRemovedImageUrl(null);
    }
    setRemovedImageBlob(null);

    // Read original image dimensions and preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      setOriginalImageSrc(src);
      setOriginalFileName(displayName);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = src;

      try {
        // Dynamic import to keep other routes free of this package
        const { removeBackground } = await import('@imgly/background-removal');

        setProgressStatus('AI মডেল প্রস্তুত হচ্ছে...');

        const blob = await removeBackground(file, {
          progress: (key: string, current: number, total: number) => {
            if (total && total > 0) {
              const pct = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
              setProgressPercent(pct);
              if (key.includes('fetch')) {
                setProgressStatus(`মডেল ফাইল ডাউনলোড হচ্ছে (${pct}%)...`);
              } else if (key.includes('compute')) {
                setProgressStatus(`AI মডেল দিয়ে ব্যাকগ্রাউন্ড আলাদা করা হচ্ছে (${pct}%)...`);
              } else {
                setProgressStatus(`প্রসেসিং চলছে (${pct}%)...`);
              }
            } else {
              setProgressStatus('ছবি বিশ্লেষণ ও প্রসেসিং চলছে...');
            }
          },
        });

        const outputUrl = URL.createObjectURL(blob);
        setRemovedImageBlob(blob);
        setRemovedImageUrl(outputUrl);
        setIsProcessing(false);
      } catch (err: unknown) {
        console.error('Background removal error:', err);
        const errMsg =
          err instanceof Error
            ? err.message
            : 'ব্যাকগ্রাউন্ড অপসারণ করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।';
        setErrorMessage(
          `প্রসেসিং ব্যর্থ হয়েছে: ${errMsg}। ব্রাউজারের হার্ডওয়্যার এক্সিলারেশন ও WebAssembly সচল আছে কি না দেখে পুনরায় চেষ্টা করুন।`
        );
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('ছবি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  // Handle file validation & upload
  const handleFileSelect = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage('শুধুমাত্র JPG, JPEG, PNG অথবা WebP ফরম্যাটের ছবি আপলোড করুন।');
      return;
    }

    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > MAX_FILE_SIZE_MB) {
      setErrorMessage(
        `ফাইলের সাইজ অনেক বড় (${fileSizeMb.toFixed(1)} MB)। অনুগ্রহ করে ${MAX_FILE_SIZE_MB} MB-এর কম সাইজের ছবি আপলোড করুন।`
      );
      return;
    }

    processImageFile(file, file.name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Load sample image for instant testing
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient for sample
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 700);
    bgGrad.addColorStop(0, '#e2e8f0');
    bgGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 700);

    // Decorative background pattern
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(40, 60, 220, 150);
    ctx.fillRect(380, 80, 160, 200);

    // Shoulders / Suit body
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(300, 650, 230, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(250, 470);
    ctx.lineTo(300, 540);
    ctx.lineTo(350, 470);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#f6d8b8';
    ctx.fillRect(270, 410, 60, 80);

    // Face / Head
    ctx.fillStyle = '#ffd5b2';
    ctx.beginPath();
    ctx.ellipse(300, 310, 110, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(300, 200, 120, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(260, 300, 8, 0, Math.PI * 2);
    ctx.arc(340, 300, 8, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(300, 350, 35, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Watermark text on canvas
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('নমুনা পোর্ট্রেট টেস্ট ছবি', 300, 80);

    canvas.toBlob((blob) => {
      if (blob) {
        processImageFile(blob, 'sample_portrait.png');
      }
    }, 'image/png');
  };

  // Download high-resolution processed image
  const handleDownload = () => {
    if (!removedImageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || originalDimensions?.width || 800;
      canvas.height = img.naturalHeight || originalDimensions?.height || 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background if not transparent
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (exportFormat === 'jpeg') {
        // JPEG doesn't support alpha, default to white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw the transparent cutout on top
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = 0.95;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const baseName = originalFileName.replace(/\.[^/.]+$/, '') || 'photo_cutout';
      const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const fileName = `${baseName}_no_bg.${ext}`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = removedImageUrl;
  };

  // Schema.org FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'এই টুল কি সত্যিই সম্পূর্ণ ফ্রি, কোনো লিমিট আছে কি?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'হ্যাঁ, Utools.bd-এর ছবির ব্যাকগ্রাউন্ড রিমুভার সম্পূর্ণ ফ্রি এবং শতভাগ আনলিমিটেড। remove.bg বা অন্যান্য ওয়েবসাইটের মতো এখানে কোনো পেইড সাবস্ক্রিপশন, ক্রেডিট সিস্টেম বা রেজোলিউশন ডাউনস্কেলিং নেই। আপনি যেকোনো সংখ্যক ছবি ফুল রেজোলিউশনে রিমুভ ও ডাউনলোড করতে পারবেন।',
        },
      },
      {
        '@type': 'Question',
        name: 'ছবি কি কোনো সার্ভারে আপলোড হয়? আমার ছবির প্রাইভেসি কতটা নিরাপদ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'আপনার কোনো ছবি কখনোই কোনো সার্ভারে আপলোড হয় না। পুরো ব্যাকগ্রাউন্ড অপসারণ প্রক্রিয়াটি WebAssembly ও ONNX Runtime-এর সাহায্যে সরাসরি আপনার নিজস্ব ব্রাউজার ও ডিভাইসেই স্থানীয়ভাবে রান করে। আপনার ব্যক্তিগত ছবি আপনার ডিভাইসেই সুরক্ষিত থাকে।',
        },
      },
      {
        '@type': 'Question',
        name: 'কেমন কোয়ালিটির রেজাল্ট পাওয়া যায়?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'অত্যাধুনিক ডিপ লার্নিং সেলিয়েন্ট অবজেক্ট ডিটেকশন মডেল ব্যবহারের ফলে মানুষ, পোর্ট্রেট, জামাকাপড়, চুলের প্রান্ত, পণ্য ও বিভিন্ন বস্তুর কিনারা অত্যন্ত নিখুঁত ও প্রফেশনালভাবে আলাদা করা সম্ভব হয়। আউটপুট ছবি মূল রেজোলিউশনেই সংরক্ষিত থাকে।',
        },
      },
      {
        '@type': 'Question',
        name: 'কোন ফরম্যাটের ছবি সাপোর্ট করে?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'টুলটি বহুল ব্যবহৃত JPG, JPEG, PNG এবং আধুনিক WebP ফরম্যাটের ছবি সাপোর্ট করে। আপনি ফলাফল হিসেবে ট্রান্সপারেন্ট PNG অথবা সাদা/রঙিন ব্যাকগ্রাউন্ড সহ JPG/PNG ডাউনলোড করতে পারবেন।',
        },
      },
      {
        '@type': 'Question',
        name: 'ব্যাকগ্রাউন্ডে সাদা বা পাসপোর্ট ব্লু ব্যাকগ্রাউন্ড কীভাবে যোগ করব?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ব্যাকগ্রাউন্ড রিমুভ হওয়ার পর নিচের "ব্যাকগ্রাউন্ড কালার নির্বাচন করুন" সেকশন থেকে "সাদা" বাটনে ক্লিক করলেই এক ক্লিকে ছবির পেছনে নিখুঁত সাদা ব্যাকগ্রাউন্ড যুক্ত হয়ে যাবে। এছাড়া পাসপোর্ট স্কাই ব্লু, অফিশিয়াল ব্লু বা যেকোনো কাস্টম কালার পিকার দিয়ে মনমতো ব্যাকগ্রাউন্ড বসাতে পারবেন।',
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Helmet>
        <title>ফ্রি ছবির ব্যাকগ্রাউন্ড রিমুভার — AI দিয়ে ছবির ব্যাকগ্রাউন্ড সরান | Utools.bd</title>
        <meta
          name="description"
          content="অন-ডিভাইস AI দিয়ে সম্পূর্ণ বিনামূল্যে ছবির ব্যাকগ্রাউন্ড সরান বা সাদা/রঙিন ব্যাকগ্রাউন্ড যোগ করুন। ১০০% ক্লায়েন্ট-সাইড, ফুল রেজোলিউশন ও আনলিমিটেড।"
        />
        <meta
          property="og:title"
          content="ফ্রি ছবির ব্যাকগ্রাউন্ড রিমুভার — AI দিয়ে ছবির ব্যাকগ্রাউন্ড সরান | Utools.bd"
        />
        <meta
          property="og:description"
          content="অন-ডিভাইস AI দিয়ে সম্পূর্ণ বিনামূল্যে ছবির ব্যাকগ্রাউন্ড সরান বা সাদা/রঙিন ব্যাকগ্রাউন্ড যোগ করুন। কোনো সার্ভার আপলোড নেই, শতভাগ নিরাপদ ও আনলিমিটেড।"
        />
        <meta property="og:url" content="https://utools.bd/background-remover" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://utools.bd/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ছবির ব্যাকগ্রাউন্ড রিমুভার | Utools.bd" />
        <meta
          name="twitter:description"
          content="১০০% ব্রাউজারে অন-ডিভাইস AI দিয়ে ছবির ব্যাকগ্রাউন্ড রিমুভ ও সাদা ব্যাকগ্রাউন্ড বসানোর ফ্রি টুল।"
        />
        <meta name="twitter:image" content="https://utools.bd/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Top Breadcrumb & Privacy Guarantee */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5E4DB]">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="border border-[#D5E4DB] bg-[#FFFFFF] hover:bg-[#F0F4F2] px-3 py-1.5 text-xs text-[#084A2E] flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমপেজে ফিরুন</span>
          </Link>
        </div>

        {/* 100% Client-Side Privacy Badge */}
        <div className="flex items-center space-x-2 text-xs font-medium text-[#084A2E] bg-[#FFFFFF] border border-[#D5E4DB] px-3 py-1.5 shadow-xs rounded-lg">
          <ShieldCheck className="w-4 h-4 text-[#0B5D3B]" />
          <span>১০০% ক্লায়েন্ট-সাইড অন-ডিভাইস AI (কোনো ছবি সার্ভারে যায় না)</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="bg-[#0B5D3B]/10 text-[#0B5D3B] text-xs px-2.5 py-0.5 border border-[#0B5D3B]/20 font-medium">
            ব্রাউজার AI • WebAssembly
          </span>
          <span className="text-xs text-[#4A5A52]">অফলাইন সমর্থিত</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#084A2E] font-serif tracking-tight">
          ছবির ব্যাকগ্রাউন্ড রিমুভার — ফ্রি ও আনলিমিটেড
        </h1>
        <p className="text-xs sm:text-sm text-[#4A5A52] max-w-3xl leading-relaxed">
          কোনো সার্ভার কল ছাড়াই সরাসরি আপনার ব্রাউজারে অন-ডিভাইস ডিপ লার্নিং মডেল চালিয়ে যেকোনো ছবির ব্যাকগ্রাউন্ড নিখুঁতভাবে অপসারণ করুন। পাসপোর্ট ছবির জন্য এক ক্লিকে সাদা বা কাস্টম ব্যাকগ্রাউন্ড যোগ করার পূর্ণ সুবিধা।
        </p>
      </div>

      {/* Positioning / Competitive Advantage Box */}
      <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-md bg-[#0B5D3B]/10 border border-[#0B5D3B]/30 flex items-center justify-center shrink-0 text-[#0B5D3B] mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-[#0F1F17]">
            <strong className="text-[#084A2E] block font-serif">
              কেন এটি সাধারণ অনলাইন ব্যাকগ্রাউন্ড রিমুভারের চেয়ে আলাদা?
            </strong>
            <span className="text-[#34443B] leading-relaxed">
              remove.bg বা অন্যান্য জনপ্রিয় সাইটে ফ্রি ভার্সনে রেজোলিউশন কমিয়ে দেয় (লো-রেজ) এবং মাত্র কয়েকটি ছবি করার পর পেমেন্ট চায়। Utools.bd-তে এটি <strong>সম্পূর্ণ ফ্রি, ফুল রেজোলিউশন এবং আনলিমিটেড ব্যবহার</strong> — কারণ প্রসেসিং আপনার ব্রাউজারেই ঘটে!
            </span>
          </div>
        </div>
      </div>

      {/* First-time Model Download Notice */}
      <div className="bg-[#F8FAF9] border border-[#D5E4DB] p-3 text-xs text-[#4A5A52] flex items-start gap-2.5 rounded-2xl">
        <AlertCircle className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#084A2E]">গুরুত্বপূর্ণ তথ্য:</strong> প্রথমবার ব্যবহারের সময় AI মডেল ও WebAssembly ফাইল ব্রাউজারে ডাউনলোড হতে কয়েক সেকেন্ড সময় লাগতে পারে (~কয়েক মেগাবাইট)। একবার ডাউনলোড হয়ে গেলে ব্রাউজার ক্যাশ (Cache) থেকে পরের বার মুহূর্তেই কাজ করবে।
        </p>
      </div>

      {/* Main Workspace Area */}
      <div className="space-y-6">
        {/* Step 1: Upload Zone (or Current Image Switcher) */}
        {!originalImageSrc ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer bg-[#FFFFFF]  rounded-2xl ${
              isDragOver
                ? 'border-[#0B5D3B] bg-[#F0F4F2]'
                : 'border-[#D5E4DB] hover:border-[#0B5D3B]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto bg-[#F0F4F2] border border-[#D5E4DB] flex items-center justify-center text-[#084A2E] rounded-lg">
                <Upload className="w-7 h-7 text-[#0B5D3B]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#084A2E]">
                  ছবি ড্র্যাগ করে এখানে ছাড়ুন অথবা ফাইল বাছাই করতে ক্লিক করুন
                </p>
                <p className="text-xs text-[#4A5A52]">
                  সাপোর্টেড ফরম্যাট: JPG, PNG, WebP (সর্বোচ্চ {MAX_FILE_SIZE_MB} MB)
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-[#0B5D3B] hover:bg-[#084A2E] text-[#FFFFFF] px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ছবি আপলোড করুন
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample();
                  }}
                  className="border border-[#D5E4DB] bg-[#F0F4F2] hover:bg-[#D5E4DB]/50 text-[#0F1F17] px-4 py-2 text-xs font-medium transition-colors cursor-pointer rounded-lg"
                >
                  নমুনা ছবি দিয়ে দেখুন
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Workspace Controls when image is loaded */
          <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border border-[#D5E4DB] bg-[#F0F4F2] overflow-hidden flex items-center justify-center shrink-0 rounded-lg">
                <img
                  src={originalImageSrc}
                  alt="থাম্বনেইল"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#084A2E] truncate max-w-xs sm:max-w-sm">
                  {originalFileName}
                </div>
                {originalDimensions && (
                  <div className="text-[#4A5A52] font-mono mt-0.5">
                    রেজোলিউশন: {originalDimensions.width} × {originalDimensions.height} পিক্সেল
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="border border-[#D5E4DB] bg-[#F0F4F2] hover:bg-[#D5E4DB]/50 px-3 py-2 text-xs text-[#0F1F17] flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50 rounded-lg"
              >
                <Upload className="w-3.5 h-3.5 text-[#084A2E]" />
                <span>অন্য ছবি দিন</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isProcessing}
                className="border border-[#D5E4DB] bg-[#FFFFFF] hover:bg-[#F0F4F2] px-3 py-2 text-xs text-[#4A5A52] transition-colors cursor-pointer disabled:opacity-50 hidden sm:inline-block rounded-lg"
              >
                নমুনা ছবি
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-[#fff5f5] border border-[#fecaca] p-4 text-xs text-[#b91c1c] flex items-start space-x-2.5 rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">ত্রুটি ঘটেছে:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Processing State with Live Progress Callback */}
        {isProcessing && (
          <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-8 sm:p-12 text-center space-y-5 rounded-2xl">
            <div className="w-16 h-16 mx-auto border-4 border-[#0B5D3B]/20 border-t-[#0B5D3B] rounded-full animate-spin"></div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-sm sm:text-base font-bold text-[#084A2E] font-serif">
                {progressStatus || 'AI মডেল দিয়ে ছবির ব্যাকগ্রাউন্ড প্রক্রিয়াকরণ হচ্ছে...'}
              </h3>
              <p className="text-xs text-[#4A5A52]">
                ছবি ব্রাউজারেই লোকালি প্রসেস হচ্ছে, কোনো ছবি ইন্টারনেটে বা সার্ভারে আপলোড হচ্ছে না।
              </p>
              {progressPercent > 0 && (
                <div className="pt-2 space-y-1">
                  <div className="w-full bg-[#F0F4F2] h-2.5 border border-[#D5E4DB] overflow-hidden rounded-lg">
                    <div
                      className="bg-[#0B5D3B] h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-mono text-[#4A5A52] text-right">
                    {progressPercent}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Output & Comparison Workspace */}
        {removedImageUrl && originalImageSrc && !isProcessing && (
          <div className="space-y-6">
            {/* View Mode Switcher Header */}
            <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#084A2E] font-serif">
                <SlidersHorizontal className="w-4 h-4 text-[#0B5D3B]" />
                <span>তুলনা ও প্রিভিউ মোড:</span>
              </div>

              <div className="flex items-center space-x-1 border border-[#D5E4DB] p-0.5 bg-[#F0F4F2] rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('slider')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    viewMode === 'slider'
                      ? 'bg-[#FFFFFF] text-[#084A2E] shadow-xs font-semibold'
                      : 'text-[#4A5A52] hover:text-[#084A2E]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ইন্টারেক্টিভ স্লাইডার</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    viewMode === 'side-by-side'
                      ? 'bg-[#FFFFFF] text-[#084A2E] shadow-xs font-semibold'
                      : 'text-[#4A5A52] hover:text-[#084A2E]'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>পাশাপাশি ভিউ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('result')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    viewMode === 'result'
                      ? 'bg-[#FFFFFF] text-[#084A2E] shadow-xs font-semibold'
                      : 'text-[#4A5A52] hover:text-[#084A2E]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>শুধু ফলাফল</span>
                </button>
              </div>
            </div>

            {/* Visual Canvas Area */}
            <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-4 sm:p-6 overflow-hidden rounded-2xl">
              {/* 1. Interactive Slider View */}
              {viewMode === 'slider' && (
                <div className="space-y-3">
                  <div
                    ref={sliderContainerRef}
                    onMouseDown={() => setIsDraggingSlider(true)}
                    onTouchStart={() => setIsDraggingSlider(true)}
                    className="relative w-full max-w-3xl mx-auto h-[380px] sm:h-[480px] select-none cursor-ew-resize overflow-hidden border border-[#D5E4DB] shadow-inner"
                    style={{
                      backgroundColor:
                        backgroundColor === 'transparent' ? undefined : backgroundColor,
                      backgroundImage:
                        backgroundColor === 'transparent'
                          ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%)'
                          : undefined,
                      backgroundSize: '16px 16px',
                    }}
                  >
                    {/* Layer 1 (Bottom): Cutout result with chosen background */}
                    <img
                      src={removedImageUrl}
                      alt="ব্যাকগ্রাউন্ড রিমুভড"
                      width={originalDimensions?.width || 800}
                      height={originalDimensions?.height || 600}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />

                    {/* Layer 2 (Top): Original image clipped by slider position */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none border-r-2 border-[#0B5D3B]"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={originalImageSrc}
                        alt="মূল ছবি"
                        width={originalDimensions?.width || 800}
                        height={originalDimensions?.height || 600}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none"
                        style={{
                          width: sliderContainerRef.current?.clientWidth || '100%',
                          height: '100%',
                        }}
                      />
                    </div>

                    {/* Slider Handle Knob */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-[#0B5D3B] -ml-0.5 pointer-events-none flex items-center justify-center"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-7 h-7 bg-[#FFFFFF] border-2 border-[#0B5D3B] shadow-md flex items-center justify-center text-[#084A2E] pointer-events-auto cursor-ew-resize rounded-lg">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B5D3B]" />
                      </div>
                    </div>

                    {/* Badges on preview */}
                    <div className="absolute top-3 left-3 bg-[#084A2E]/80 text-[#FFFFFF] text-[11px] px-2 py-0.5 pointer-events-none">
                      আগে (মূল ছবি)
                    </div>
                    <div className="absolute top-3 right-3 bg-[#0B5D3B]/90 text-[#FFFFFF] text-[11px] px-2 py-0.5 pointer-events-none">
                      পরে (রিমুভড)
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-[#4A5A52]">
                    ↔️ স্লাইডারটি ডানে বা বামে টেনে মূল ছবি বনাম রিমুভড ছবির নিখুঁত পার্থক্য তুলনা করুন
                  </p>
                </div>
              )}

              {/* 2. Side by Side View */}
              {viewMode === 'side-by-side' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {/* Left: Original */}
                  <div className="border border-[#D5E4DB] bg-[#F0F4F2]/40 p-2 space-y-2 rounded-lg">
                    <div className="text-xs font-semibold text-[#084A2E] flex items-center justify-between px-1">
                      <span>আসল ছবি (Original)</span>
                      <span className="text-[11px] font-mono text-[#4A5A52]">
                        {originalDimensions?.width} × {originalDimensions?.height}
                      </span>
                    </div>
                    <div className="h-72 sm:h-96 flex items-center justify-center bg-[#FFFFFF] border border-[#D5E4DB] p-1 overflow-hidden rounded-lg">
                      <img
                        src={originalImageSrc}
                        alt="মূল ছবি"
                        width={originalDimensions?.width || 800}
                        height={originalDimensions?.height || 600}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Right: Cutout */}
                  <div className="border border-[#D5E4DB] bg-[#F0F4F2]/40 p-2 space-y-2 rounded-lg">
                    <div className="text-xs font-semibold text-[#0B5D3B] flex items-center justify-between px-1">
                      <span>ব্যাকগ্রাউন্ড রিমুভড (AI Cutout)</span>
                      <span className="text-[11px] text-[#0B5D3B] font-medium">১০০% ফুল কোয়ালিটি</span>
                    </div>
                    <div
                      className="h-72 sm:h-96 flex items-center justify-center border border-[#D5E4DB] p-1 overflow-hidden"
                      style={{
                        backgroundColor:
                          backgroundColor === 'transparent' ? undefined : backgroundColor,
                        backgroundImage:
                          backgroundColor === 'transparent'
                            ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%)'
                            : undefined,
                        backgroundSize: '16px 16px',
                      }}
                    >
                      <img
                        src={removedImageUrl}
                        alt="রিমুভড ছবি"
                        width={originalDimensions?.width || 800}
                        height={originalDimensions?.height || 600}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Single Result View */}
              {viewMode === 'result' && (
                <div className="max-w-2xl mx-auto space-y-2">
                  <div
                    className="h-80 sm:h-[440px] flex items-center justify-center border border-[#D5E4DB] p-2 overflow-hidden shadow-inner"
                    style={{
                      backgroundColor:
                        backgroundColor === 'transparent' ? undefined : backgroundColor,
                      backgroundImage:
                        backgroundColor === 'transparent'
                          ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%)'
                          : undefined,
                      backgroundSize: '16px 16px',
                    }}
                  >
                    <img
                      src={removedImageUrl}
                      alt="ফলাফল"
                      width={originalDimensions?.width || 800}
                      height={originalDimensions?.height || 600}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Background Color Bar (Key Synergy Feature) */}
            <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-4 sm:p-6 space-y-4 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5E4DB]">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[#084A2E] font-serif uppercase tracking-wider flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-[#0B5D3B]" />
                    <span>নতুন ব্যাকগ্রাউন্ড রঙ বসান (Background Color)</span>
                  </h3>
                  <p className="text-xs text-[#4A5A52]">
                    ট্রান্সপারেন্ট রাখুন অথবা সরকারি চাকরি/পাসপোর্টের জন্য এক ক্লিকে সাদা/নীল ব্যাকগ্রাউন্ড বসান।
                  </p>
                </div>

                {/* Instant White Button for Passport Synergy */}
                <button
                  type="button"
                  onClick={() => setBackgroundColor('#ffffff')}
                  className={`px-3.5 py-1.5 text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                    backgroundColor === '#ffffff'
                      ? 'bg-[#084A2E] text-[#FFFFFF] border-[#084A2E]'
                      : 'bg-[#FFFFFF] text-[#084A2E] border-[#0B5D3B] hover:bg-[#F0F4F2]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5D3B]" />
                  <span>সাদা ব্যাকগ্রাউন্ড (পাসপোর্ট স্ট্যান্ডার্ড)</span>
                </button>
              </div>

              {/* Color Preset Palette */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = backgroundColor === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBackgroundColor(preset.value)}
                      className={`flex items-center space-x-2 px-3 py-1.5 text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#084A2E] bg-[#F0F4F2] font-semibold text-[#084A2E] ring-1 ring-[#084A2E]'
                          : 'border-[#D5E4DB] bg-[#FFFFFF] text-[#0F1F17] hover:bg-[#F0F4F2]'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 inline-block shrink-0 border ${
                          preset.value === 'transparent'
                            ? 'bg-[repeating-conic-gradient(#cbd5e1_0%_25%,#ffffff_0%_50%)] [background-size:6px_6px] border-[#94a3b8]'
                            : 'border-[#94a3b8]'
                        }`}
                        style={{
                          backgroundColor:
                            preset.value === 'transparent' ? undefined : preset.value,
                        }}
                      ></span>
                      <span>{preset.name}</span>
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <div className="flex items-center space-x-2 border border-[#D5E4DB] bg-[#FFFFFF] px-2 py-1 rounded-lg">
                  <input
                    type="color"
                    id="custom-bg-color-picker"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setBackgroundColor(e.target.value);
                    }}
                    className="w-6 h-6 border-0 p-0 cursor-pointer bg-transparent"
                    title="কাস্টম কালার বাছাই করুন"
                  />
                  <label
                    htmlFor="custom-bg-color-picker"
                    className="text-xs text-[#4A5A52] cursor-pointer font-mono"
                  >
                    {customColor.toUpperCase()}
                  </label>
                </div>
              </div>
            </div>

            {/* Download & Export Card */}
            <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-4 sm:p-6 space-y-4 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#084A2E] font-serif uppercase tracking-wider flex items-center space-x-2">
                    <Download className="w-4 h-4 text-[#0B5D3B]" />
                    <span>ছবি ডাউনলোড করুন (Download HD Cutout)</span>
                  </h3>
                  <p className="text-xs text-[#4A5A52]">
                    ফুল এইচডি রেজোলিউশনে সেভ হবে — কোনো ওয়াটারমার্ক নেই।
                  </p>
                </div>

                {/* Export Format Selector */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[#4A5A52]">ফরম্যাট:</span>
                  <div className="flex border border-[#D5E4DB] bg-[#F0F4F2] p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setExportFormat('png')}
                      className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                        exportFormat === 'png'
                          ? 'bg-[#FFFFFF] text-[#084A2E] font-bold shadow-xs'
                          : 'text-[#4A5A52] hover:text-[#084A2E]'
                      }`}
                    >
                      PNG {backgroundColor === 'transparent' ? '(স্বচ্ছ)' : ''}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat('jpeg')}
                      className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                        exportFormat === 'jpeg'
                          ? 'bg-[#FFFFFF] text-[#084A2E] font-bold shadow-xs'
                          : 'text-[#4A5A52] hover:text-[#084A2E]'
                      }`}
                    >
                      JPG
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#D5E4DB]">
                <button
                  type="button"
                  onClick={() => {
                    if (originalImageSrc) {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.drawImage(img, 0, 0);
                          canvas.toBlob((blob) => {
                            if (blob) processImageFile(blob, originalFileName);
                          });
                        }
                      };
                      img.src = originalImageSrc;
                    }
                  }}
                  className="border border-[#D5E4DB] bg-[#F0F4F2] hover:bg-[#D5E4DB]/50 px-3.5 py-2.5 text-xs text-[#0F1F17] flex items-center space-x-1.5 transition-colors cursor-pointer rounded-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#084A2E]" />
                  <span>পুনরায় প্রসেস করুন</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="bg-[#0B5D3B] hover:bg-[#084A2E] text-[#FFFFFF] px-6 py-2.5 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ডাউনলোড করুন ({exportFormat.toUpperCase()})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Synergy Link to Government Photo Resizer */}
            <div className="bg-[#F8FAF9] border border-[#D5E4DB] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#084A2E] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0B5D3B]" />
                  <span>সরকারি চাকরি বা পাসপোর্টের ৩০০×৩০০ মাপে রিসাইজ করবেন?</span>
                </div>
                <p className="text-xs text-[#34443B]">
                  সাদা ব্যাকগ্রাউন্ড দেওয়া ছবিটি সরাসরি আমাদের "সরকারি ও পাসপোর্ট ছবি রিসাইজার" টুলে নিয়ে ৩০০×৩০০ পিক্সেল ও ১০০KB লিমিটে কনভার্ট করতে পারেন।
                </p>
              </div>

              <Link
                to="/photo-resizer"
                className="border border-[#0B5D3B] bg-[#FFFFFF] hover:bg-[#0B5D3B] hover:text-[#FFFFFF] text-[#084A2E] px-4 py-2 text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <span>পাসপোর্ট রিসাইজারে যান</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Feature & Benefits Bento Grid */}
      <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-5 sm:p-6 space-y-5 rounded-2xl">
        <h3 className="text-sm font-bold text-[#084A2E] font-serif uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#0B5D3B]" />
          <span>অন-ডিভাইস AI ব্যাকগ্রাউন্ড রিমুভারের বিশেষ সুবিধাসমূহ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-[#34443B] leading-relaxed">
          <div className="bg-[#F0F4F2]/40 border border-[#D5E4DB] p-4 space-y-2 rounded-2xl">
            <div className="w-8 h-8 bg-[#0B5D3B]/10 border border-[#0B5D3B]/30 flex items-center justify-center text-[#0B5D3B] rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-[#084A2E] text-sm font-serif">১. ১০০% গোপনীয়তা ও নিরাপদ</h4>
            <p>
              আপনার ছবি কোনো দূরবর্তী সার্ভারে আপলোড হয় না। পুরো এআই ইনফারেন্স রান করে আপনার নিজস্ব ব্রাউজারে WebAssembly-এর শক্তিতে।
            </p>
          </div>

          <div className="bg-[#F0F4F2]/40 border border-[#D5E4DB] p-4 space-y-2 rounded-2xl">
            <div className="w-8 h-8 bg-[#0B5D3B]/10 border border-[#0B5D3B]/30 flex items-center justify-center text-[#0B5D3B] rounded-lg">
              <Maximize2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-[#084A2E] text-sm font-serif">২. আসল রেজোলিউশন ও আনলিমিটেড</h4>
            <p>
              অন্যান্য সাইটের মতো ছবির রেজোলিউশন কমিয়ে দেয় না। আপনি যে সাইজের ছবি আপলোড করবেন, ঠিক সেই ফুল রেজোলিউশনেই কাটআউট পাবেন।
            </p>
          </div>

          <div className="bg-[#F0F4F2]/40 border border-[#D5E4DB] p-4 space-y-2 rounded-2xl">
            <div className="w-8 h-8 bg-[#0B5D3B]/10 border border-[#0B5D3B]/30 flex items-center justify-center text-[#0B5D3B] rounded-lg">
              <Palette className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-[#084A2E] text-sm font-serif">৩. এক ক্লিকে পাসপোর্ট ব্যাকগ্রাউন্ড</h4>
            <p>
              টেলিটক, বিসিএস ও পাসপোর্ট আবেদনের জন্য এক ক্লিকে সাদা বা পাসপোর্ট স্কাই ব্লু ব্যাকগ্রাউন্ড বসিয়ে তাৎক্ষণিক ডাউনলোড করা যায়।
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#FFFFFF] border border-[#D5E4DB] p-5 sm:p-6 space-y-5 rounded-2xl">
        <h3 className="text-sm font-bold text-[#084A2E] font-serif uppercase tracking-wider flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-[#0B5D3B]" />
          <span>প্রায়শই জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)</span>
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-[#0F1F17] leading-relaxed">
          <div className="space-y-1 pb-3 border-b border-[#F0F4F2]">
            <h4 className="font-bold text-[#084A2E]">এই টুল কি সত্যিই ফ্রি, কোনো লিমিট আছে কি?</h4>
            <p className="text-[#34443B]">
              হ্যাঁ, Utools.bd-এর ছবির ব্যাকগ্রাউন্ড রিমুভার সম্পূর্ণ ফ্রি এবং শতভাগ আনলিমিটেড। remove.bg বা অন্যান্য সাইটের মতো এখানে কোনো ক্রেডিট সীমা বা সাবস্ক্রিপশন নেই। আপনি যত খুশি ছবি ফুল রেজোলিউশনে রিমুভ ও ডাউনলোড করতে পারেন।
            </p>
          </div>

          <div className="space-y-1 pb-3 border-b border-[#F0F4F2]">
            <h4 className="font-bold text-[#084A2E]">ছবি কি সার্ভারে আপলোড হয়?</h4>
            <p className="text-[#34443B]">
              না, কোনো ছবি কখনোই কোনো দূরবর্তী সার্ভারে আপলোড হয় না। পুরো মডেল ব্রাউজারে ক্যাশ হয়ে আপনার প্রসেসর ও জিপিইউ-এর মাধ্যমে স্থানীয়ভাবে (Locally) ছবি প্রসেস করে। ফলে আপনার সংবেদনশীল বা পারিবারিক ছবির পূর্ণ গোপনীয়তা অটুট থাকে।
            </p>
          </div>

          <div className="space-y-1 pb-3 border-b border-[#F0F4F2]">
            <h4 className="font-bold text-[#084A2E]">কেমন কোয়ালিটির রেজাল্ট পাওয়া যায়?</h4>
            <p className="text-[#34443B]">
              উন্নত অন-ডিভাইস নিউরাল নেটওয়ার্ক ব্যবহারের ফলে মানুষ, জামাকাপড়, চুলের সূক্ষ্ম প্রান্ত কিংবা পণ্যের ছবি খুবই পরিষ্কার ও প্রফেশনালভাবে ব্যাকগ্রাউন্ড থেকে আলাদা হয়ে যায়। আউটপুট মূল কোয়ালিটি এবং রেজোলিউশনেই বজায় থাকে।
            </p>
          </div>

          <div className="space-y-1 pb-3 border-b border-[#F0F4F2]">
            <h4 className="font-bold text-[#084A2E]">কোন কোন ফরম্যাটের ছবি সাপোর্ট করে?</h4>
            <p className="text-[#34443B]">
              টুলটি বহুল ব্যবহৃত JPG, JPEG, PNG ও WebP ফরম্যাটের ছবি সাপোর্ট করে। ফলাফল হিসেবে আপনি স্বচ্ছ (Transparent) PNG অথবা নতুন সলিড ব্যাকগ্রাউন্ড সহ JPG/PNG সেভ করতে পারেন।
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-[#084A2E]">পাসপোর্ট বা চাকরির আবেদনের জন্য কীভাবে ছবি তৈরি করব?</h4>
            <p className="text-[#34443B]">
              প্রথমে আপনার ছবি আপলোড করে ব্যাকগ্রাউন্ড রিমুভ করুন। এরপর কালার প্যালেট থেকে "সাদা" সিলেক্ট করে ডাউনলোড করুন। এরপর আমাদের "সরকারি ও পাসপোর্ট ছবি রিসাইজার" টুলে গিয়ে ছবিটি ৩০০×৩০০ পিক্সেল এবং ১০০KB-র নিচে রিসাইজ করে নিন।
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Linking Section ("আরও দরকারি টুলস") */}
      <RelatedTools currentToolId="background-remover" />
    </div>
  );
};
