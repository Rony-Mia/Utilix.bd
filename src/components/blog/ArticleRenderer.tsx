import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleRendererProps {
  content: string;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-none text-[#0F1F17]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#0F1F17] mt-8 mb-4 tracking-tight"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => {
            const headingId = typeof children === 'string'
              ? children.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-')
              : undefined;
            return (
              <h2
                id={headingId}
                className="text-xl sm:text-2xl font-bold text-[#0F1F17] mt-8 mb-3 pt-2 border-b border-[#D5E4DB]/40 pb-2 scroll-mt-20"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const headingId = typeof children === 'string'
              ? children.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-')
              : undefined;
            return (
              <h3
                id={headingId}
                className="text-lg sm:text-xl font-bold text-[#0F1F17] mt-6 mb-2 scroll-mt-20"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => (
            <h4
              className="text-base sm:text-lg font-bold text-[#0F1F17] mt-4 mb-2"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p className="text-sm sm:text-base text-[#4A5A52] leading-relaxed my-3" {...props}>
              {children}
            </p>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-[#0F1F17]" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="list-disc list-outside ml-5 space-y-1.5 my-3 text-sm sm:text-base text-[#4A5A52] leading-relaxed"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="list-decimal list-outside ml-5 space-y-1.5 my-3 text-sm sm:text-base text-[#4A5A52] leading-relaxed"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="pl-1 leading-relaxed" {...props}>
              {children}
            </li>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-[#D5E4DB]">
              <table className="w-full text-left border-collapse text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-[#E6F4EC] text-[#084A2E] font-bold border-b border-[#D5E4DB]" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-[#D5E4DB]/60 bg-white" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-[#F8FAF9] transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="p-3 font-semibold text-xs sm:text-sm text-[#084A2E]" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="p-3 text-xs sm:text-sm text-[#4A5A52]" {...props}>
              {children}
            </td>
          ),
          a: ({ href, children, ...props }) => {
            const isInternal =
              href &&
              (href.startsWith('/') ||
                href.startsWith('https://utools.bd') ||
                href.startsWith('http://utools.bd'));
            const cleanHref = href ? href.replace(/^https?:\/\/utools\.bd/, '') || '/' : '#';

            if (isInternal) {
              return (
                <Link
                  to={cleanHref}
                  className="font-medium text-[#0B5D3B] hover:text-[#084A2E] underline decoration-[#0B5D3B]/40 hover:decoration-[#084A2E] transition-colors"
                  {...props}
                >
                  {children}
                </Link>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0B5D3B] hover:text-[#084A2E] underline decoration-[#0B5D3B]/40 hover:decoration-[#084A2E] transition-colors inline-flex items-center gap-1"
                {...props}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-[#0B5D3B] bg-[#F8FAF9] pl-4 py-2 my-4 rounded-r-lg italic text-[#4A5A52]"
              {...props}
            >
              {children}
            </blockquote>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="bg-[#0F1F17] text-[#FAFAF7] p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={
                className
                  ? className
                  : 'px-1.5 py-0.5 bg-[#F0F4F2] text-[#0B5D3B] rounded text-xs font-mono'
              }
              {...props}
            >
              {children}
            </code>
          ),
          hr: ({ ...props }) => <hr className="my-6 border-[#D5E4DB]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
