import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { createServer as createViteServer } from 'vite';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const PORT = 3000;

export interface PresetProfile {
  id: string;
  name: string;
  org: string;
  width: number;
  height: number;
  maxSizeKb: number;
  format: 'jpeg' | 'png' | 'webp';
  aspectRatio: string;
  description: string;
}

const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'bcs_govt_photo',
    name: 'বিসিএস ও সরকারি চাকরি (ছবি)',
    org: 'Teletalk / BPSC / Ministry',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'টেলিটক ও সরকারি চাকরি আবেদনের অফিশিয়াল ৩০০×৩০০ পিক্সেল মাপ (অনূর্ধ্ব ১০০ KB)'
  },
  {
    id: 'govt_signature',
    name: 'চাকরি ও বিসিএস স্বাক্ষর (Signature)',
    org: 'Teletalk / BPSC',
    width: 300,
    height: 80,
    maxSizeKb: 60,
    format: 'jpeg',
    aspectRatio: '300:80',
    description: 'অনলাইন আবেদনের জন্য অফিশিয়াল ৩০০×৮০ পিক্সেল মাপ (অনূর্ধ্ব ৬০ KB)'
  },
  {
    id: 'bd_passport',
    name: 'বাংলাদেশ ই-পাসপোর্ট / পাসপোর্ট ছবি',
    org: 'DIP Bangladesh',
    width: 413,
    height: 531,
    maxSizeKb: 300,
    format: 'jpeg',
    aspectRatio: '413:531',
    description: '৪৫মিমি × ৫৫মিমি মাপের মানসম্মত আন্তর্জাতিক ও বাংলাদেশ পাসপোর্ট ছবি (সাদা ব্যাকগ্রাউন্ড)'
  },
  {
    id: 'primary_teacher',
    name: 'প্রাইমারি সহকারী শিক্ষক নিয়োগ ছবি',
    org: 'DPE Teletalk',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'ডিপিই প্রাথমিক শিক্ষক নিয়োগ পরীক্ষার নির্ধারিত ৩০০×৩০০ পিক্সেল'
  },
  {
    id: 'nid_portal',
    name: 'স্মার্ট এনআইডি অনলাইন পোর্টাল',
    org: 'Election Commission',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'নির্বাচন কমিশন এনআইডি সেবা ও ড্রাইভিং লাইসেন্স পোর্টাল'
  }
];

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // API: Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Utilix.bd Backend Engine',
      engine: 'Sharp High-Resolution Processor',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // API: Get verified preset specifications
  app.get('/api/image/presets', (_req: Request, res: Response) => {
    res.json({
      success: true,
      presets: PRESET_PROFILES
    });
  });

  // API: Resize and compress image
  app.post(
    '/api/image/resize',
    upload.single('image'),
    async (req: Request, res: Response): Promise<void> => {
      try {
        let inputBuffer: Buffer | null = null;

        // 1. Check if multipart file uploaded
        if (req.file && req.file.buffer) {
          inputBuffer = req.file.buffer;
        } else if (req.body && req.body.imageBase64) {
          // 2. Or base64 data URL
          const base64Str = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
          inputBuffer = Buffer.from(base64Str, 'base64');
        }

        if (!inputBuffer || inputBuffer.length === 0) {
          res.status(400).json({
            success: false,
            error: 'কোনো ইমেজ পাওয়া যায়নি। অনুগ্রহ করে একটি ইমেজ ফাইল বা base64 প্রদান করুন।'
          });
          return;
        }

        const width = Math.min(Math.max(parseInt(req.body.width || '300', 10), 10), 4000);
        const height = Math.min(Math.max(parseInt(req.body.height || '300', 10), 10), 4000);
        const maxSizeKb = req.body.maxSizeKb ? parseInt(req.body.maxSizeKb, 10) : 100;
        const targetFormat = (req.body.format || 'jpeg').toLowerCase();
        const fitMode: 'cover' | 'fill' | 'contain' =
          req.body.fit === 'cover' || req.body.fit === 'contain' ? req.body.fit : 'fill';

        // Metadata inspection
        const metadata = await sharp(inputBuffer).metadata();

        let sharpPipeline = sharp(inputBuffer)
          .rotate() // auto rotate based on EXIF
          .resize(width, height, {
            fit: fitMode,
            kernel: 'lanczos3',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          });

        let outputBuffer: Buffer;
        let finalQuality = 90;

        if (targetFormat === 'png') {
          outputBuffer = await sharpPipeline.png({ compressionLevel: 9 }).toBuffer();
        } else if (targetFormat === 'webp') {
          outputBuffer = await sharpPipeline.webp({ quality: 85 }).toBuffer();
        } else {
          // JPEG target with smart quality step down if file size exceeds target KB
          outputBuffer = await sharpPipeline.jpeg({ quality: finalQuality, mozjpeg: true }).toBuffer();

          if (maxSizeKb > 0 && outputBuffer.length > maxSizeKb * 1024) {
            // Step down quality progressively to ensure file is strictly <= maxSizeKb
            for (let q = 85; q >= 25; q -= 5) {
              const testBuffer = await sharp(inputBuffer)
                .rotate()
                .resize(width, height, {
                  fit: fitMode === 'cover' ? sharp.fit.cover : fitMode === 'contain' ? sharp.fit.contain : sharp.fit.fill,
                  kernel: sharp.kernel.lanczos3,
                  background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .jpeg({ quality: q, mozjpeg: true })
                .toBuffer();

              finalQuality = q;
              outputBuffer = testBuffer;

              if (testBuffer.length <= maxSizeKb * 1024) {
                break;
              }
            }
          }
        }

        const sizeBytes = outputBuffer.length;
        const sizeKb = Number((sizeBytes / 1024).toFixed(2));
        const mimeType =
          targetFormat === 'png'
            ? 'image/png'
            : targetFormat === 'webp'
            ? 'image/webp'
            : 'image/jpeg';

        // Check if user requested direct binary download
        if (req.query.download === '1') {
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `attachment; filename="utilix-photo-${width}x${height}.${targetFormat === 'png' ? 'png' : targetFormat === 'webp' ? 'webp' : 'jpg'}"`);
          res.send(outputBuffer);
          return;
        }

        const outputBase64 = `data:${mimeType};base64,${outputBuffer.toString('base64')}`;

        res.json({
          success: true,
          width,
          height,
          sizeBytes,
          sizeKb,
          format: targetFormat,
          mimeType,
          originalWidth: metadata.width,
          originalHeight: metadata.height,
          qualityUsed: finalQuality,
          meetsRequirement: maxSizeKb ? sizeKb <= maxSizeKb : true,
          imageBase64: outputBase64
        });
      } catch (err: any) {
        console.error('Image resize error:', err);
        res.status(500).json({
          success: false,
          error: 'ছবি রিসাইজ করতে ত্রুটি হয়েছে: ' + (err.message || 'Unknown error')
        });
      }
    }
  );

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Utilix.bd server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
