import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { ToolRelationItem } from '../types.ts';
import { toBn } from '../../utils/bnDigits.ts';

export const ToolsManagerPage: React.FC = () => {
  const [tools, setTools] = useState<ToolRelationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/tools')
      .then(res => res.json())
      .then(data => {
        if (data && data.tools) {
          setTools(data.tools);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F1F17] tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6 text-[#0B5D3B]" />
          টুল ও ব্লগ ইন্টারলিংকিং সম্পর্ক (Tools & Relations)
        </h1>
        <p className="text-xs text-[#718279] mt-1">
          Utools.bd এর প্রতিটি টুলের সাথে যুক্ত গাইড ও ব্লগ আর্টিকেলসমূহের তালিকা।
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-xs text-[#718279]">
            টুলস তালিকা লোড হচ্ছে...
          </div>
        ) : tools.map(tool => (
          <div
            key={tool.id}
            className="bg-white rounded-2xl border border-[#D5E4DB] p-5 shadow-2xs hover:border-[#0B5D3B]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F0F4F2] text-[#4A5A52]">
                  {tool.refCode}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  tool.linkedPostsCount > 0
                    ? 'bg-[#E6F4EC] text-[#0B5D3B]'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {toBn(tool.linkedPostsCount)} টি আর্টিকেল যুক্ত
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0F1F17] mb-1 leading-snug">
                {tool.title}
              </h3>
              <span className="text-[11px] font-mono text-[#718279] block mb-3">
                {tool.link}
              </span>

              {/* Linked articles list */}
              {tool.linkedPosts.length > 0 ? (
                <div className="space-y-1.5 pt-2 border-t border-[#D5E4DB]/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9C91] block mb-1">
                    সংযুক্ত আর্টিকেল:
                  </span>
                  {tool.linkedPosts.map(p => (
                    <Link
                      key={p.slug}
                      to={`/admin/posts/edit/${p.slug}`}
                      className="text-xs text-[#0B5D3B] hover:underline flex items-center gap-1.5 truncate"
                    >
                      <FileText className="w-3 h-3 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="pt-2 border-t border-[#D5E4DB]/60 text-[11px] text-amber-700 italic">
                  এই টুলে এখনো কোনো ব্লগ আর্টিকেল লিংক করা হয়নি।
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#D5E4DB]/60 mt-4 flex items-center justify-between">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#52635A] hover:text-[#0B5D3B] flex items-center gap-1"
              >
                টুল লাইভ দেখুন <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                to="/admin/posts/new"
                className="text-xs font-bold text-[#0B5D3B] hover:text-[#084A2E] flex items-center gap-1"
              >
                নতুন গাইড লিখুন <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
