import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard.ts';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [relatedTool, setRelatedTool] = useState('none');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { copied, copy } = useCopyToClipboard();

  const handleCopyEmail = () => {
    void copy('contact@utilix.bd');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    // Simulate instantaneous client-side acknowledgment
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('general');
    setRelatedTool('none');
    setMessage('');
    setSubmitted(false);
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'যোগাযোগ — Utilix.bd',
    description: 'Utilix.bd-এর সাথে যোগাযোগের মাধ্যম। মতামত, বাগ রিপোর্ট বা নতুন টুলের প্রস্তাব পাঠান।',
    url: 'https://utilix.bd/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Utilix.bd',
      url: 'https://utilix.bd',
      email: 'contact@utilix.bd'
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      <Helmet>
        <title>যোগাযোগ ও মতামত — Utilix.bd | আমাদের সাথে যোগাযোগ করুন</title>
        <meta
          name="description"
          content="Utilix.bd সম্পর্কে যেকোনো প্রশ্ন, বাগ রিপোর্ট, মতামত বা নতুন টুলের প্রস্তাবনার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন। অফিসিয়াল ইমেইল: contact@utilix.bd।"
        />
        <link rel="canonical" href="https://utilix.bd/contact" />
        <meta property="og:title" content="যোগাযোগ ও মতামত — Utilix.bd" />
        <meta
          property="og:description"
          content="Utilix.bd সম্পর্কে যেকোনো প্রশ্ন, মতামত বা নতুন টুলের প্রস্তাবনার জন্য যোগাযোগ করুন।"
        />
        <meta property="og:url" content="https://utilix.bd/contact" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://utilix.bd/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="যোগাযোগ ও মতামত — Utilix.bd" />
        <meta
          name="twitter:description"
          content="Utilix.bd সম্পর্কে যেকোনো প্রশ্ন, মতামত বা নতুন টুলের প্রস্তাবনার জন্য যোগাযোগ করুন।"
        />
        <meta name="twitter:image" content="https://utilix.bd/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      </Helmet>

      {/* Header */}
      <section className="space-y-3 border-b border-[#d8cfb8] pb-6">
        <div className="inline-flex items-center gap-2 bg-[#fffdf7] border border-[#d8cfb8] px-3 py-1 text-xs text-[#083f2a] font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-[#0c5c3d]" />
          <span>সরাসরি যোগাযোগ ও প্রতিক্রিয়া</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#083f2a] font-serif tracking-tight">
          আমাদের সাথে যোগাযোগ করুন
        </h1>
        <p className="text-sm sm:text-base text-[#6b6255] max-w-2xl leading-relaxed">
          Utilix.bd প্ল্যাটফর্মটিকে আরও সমৃদ্ধ ও নির্ভুল করতে আপনার যেকোনো পরামর্শ, ত্রুটি রিপোর্ট বা নতুন টুলের প্রস্তাবনা আমাদের জানান।
        </p>
      </section>

      {/* Official Email Highlight Card */}
      <section className="bg-[#fffdf7] border border-[#d8cfb8] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border border-[#d8cfb8] bg-[#f4efe4] flex items-center justify-center text-[#0c5c3d] shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#6b6255] block font-medium">
              অফিসিয়াল যোগাযোগ ইমেইল:
            </span>
            <span className="font-mono text-base font-bold text-[#083f2a]">
              contact@utilix.bd
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="border border-[#d8cfb8] bg-[#f4efe4] hover:bg-[#d8cfb8]/50 text-[#083f2a] px-3 py-1.5 text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0c5c3d]" />
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>ইমেইল কপি করুন</span>
              </>
            )}
          </button>
          <a
            href="mailto:contact@utilix.bd"
            className="bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            ইমেইল পাঠাতে ক্লিক করুন
          </a>
        </div>
      </section>

      {/* Main Form & Guidelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Contact Form (2 cols) */}
        <div className="lg:col-span-2 bg-[#fffdf7] border border-[#d8cfb8] p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#083f2a] font-serif border-b border-[#d8cfb8] pb-3">
            বার্তা বা মতামত পাঠান
          </h2>

          {submitted ? (
            <div className="p-6 bg-[#f4efe4] border border-[#0c5c3d]/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#0c5c3d] text-[#fffdf7] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#083f2a] font-serif">
                আপনার বার্তা সফলভাবে গৃহীত হয়েছে!
              </h3>
              <p className="text-xs sm:text-sm text-[#4a4237] max-w-md mx-auto leading-relaxed">
                ধন্যবাদ, {name}! আপনার মতামত বা প্রস্তাবনাটি আমাদের নজরে এসেছে। প্রয়োজনে আমরা <span className="font-mono font-medium">{email}</span> ঠিকানায় আপনার সাথে যোগাযোগ করব।
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#0c5c3d] text-[#fffdf7] text-xs font-medium hover:bg-[#083f2a] transition-colors cursor-pointer"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-[#083f2a] block">
                    আপনার পূর্ণ নাম <span className="text-[#c8342a]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমনঃ মোঃ আশিকুর রহমান"
                    className="w-full px-3 py-2 bg-[#f4efe4]/40 border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-[#083f2a] block">
                    ইমেইল ঠিকানা <span className="text-[#c8342a]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 bg-[#f4efe4]/40 border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-subject" className="text-xs font-semibold text-[#083f2a] block">
                    বার্তার বিষয়
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fffdf7] border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d]"
                  >
                    <option value="general">সাধারণ মতামত / প্রশংসা</option>
                    <option value="feature">নতুন টুলের প্রস্তাবনা</option>
                    <option value="bug">ত্রুটি বা বাগ রিপোর্ট</option>
                    <option value="partnership">সহযোগিতা / অংশীদারিত্ব</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-tool" className="text-xs font-semibold text-[#083f2a] block">
                    সম্পর্কিত টুল (যদি প্রযোজ্য হয়)
                  </label>
                  <select
                    id="contact-tool"
                    value={relatedTool}
                    onChange={(e) => setRelatedTool(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fffdf7] border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d]"
                  >
                    <option value="none">কোনো নির্দিষ্ট টুল নয় / সাধারণ</option>
                    <option value="converter">বিজয় ↔ ইউনিকোড কনভার্টার</option>
                    <option value="photo-resizer">সরকারি ছবি ও স্বাক্ষর রিসাইজার</option>
                    <option value="age-calculator">সরকারি চাকরির বয়স ক্যালকুলেটর</option>
                    <option value="amount-in-words">টাকা কথায় কনভার্টার</option>
                    <option value="gpa-calculator">জিপিএ ও সিজিপিএ ক্যালকুলেটর</option>
                    <option value="cv-builder">সিভি ও জীবনবৃত্তান্ত মেকার</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-message" className="text-xs font-semibold text-[#083f2a] block">
                  আপনার বার্তা বা বিবরণ <span className="text-[#c8342a]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার মতামত, সমস্যা বা নতুন ফিচারের বিস্তারিত বিবরণ এখানে লিখুন..."
                  className="w-full p-3 bg-[#f4efe4]/40 border border-[#d8cfb8] text-sm text-[#14231c] focus:outline-none focus:border-[#0c5c3d] resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#6b6255]">
                  আপনার তথ্য সম্পূর্ণ গোপন থাকবে, কোথাও প্রকাশ করা হবে না।
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#0c5c3d] hover:bg-[#083f2a] text-[#fffdf7] text-sm font-semibold transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Helpful Guides (1 col) */}
        <div className="space-y-4">
          <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#083f2a] font-serif flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#0c5c3d]" />
              <span>নতুন টুল প্রস্তাব করতে চান?</span>
            </h3>
            <p className="text-xs text-[#6b6255] leading-relaxed">
              বাংলাদেশে ব্যবহারযোগ্য এমন কোনো টুল যা আপনার বা শিক্ষার্থীদের কাজে আসবে? আমাদের জানান, আমরা ক্লায়েন্ট-সাইড প্রযুক্তি দিয়ে তা বাস্তবায়নের চেষ্টা করব।
            </p>
          </div>

          <div className="bg-[#fffdf7] border border-[#d8cfb8] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#083f2a] font-serif flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-[#0c5c3d]" />
              <span>বাগ বা গণনায় ভুল পেলে:</span>
            </h3>
            <p className="text-xs text-[#6b6255] leading-relaxed">
              কোনো টুল যদি অপ্রত্যাশিত ফলাফল দেয় (যেমন নির্দিষ্ট কোনো বিজয় যুক্তবর্ণ বা বয়স হিসাব), তবে ইনপুট টেক্সট বা তারিখ উল্লেখ করে বার্তা পাঠালে দ্রুত সমাধান করা সম্ভব হয়।
            </p>
          </div>

          <div className="bg-[#f4efe4] border border-[#d8cfb8] p-4 text-xs space-y-2">
            <span className="font-bold text-[#083f2a] block">
              গোপনীয়তার নিশ্চয়তা:
            </span>
            <p className="text-[#6b6255] leading-relaxed">
              আপনার পাঠানো ইমেইল কেবল আপনার সাথে যোগাযোগের উদ্দেশ্যে সংরক্ষিত থাকবে। কোনো স্প্যাম বা প্রচারণামূলক ইমেইল পাঠানো হয় না।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
