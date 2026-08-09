import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      className="prose prose-slate max-w-none prose-p:text-body-md prose-headings:text-primary prose-a:text-[#0088e1]"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative group rounded-xl overflow-hidden hard-shadow-sm my-4 border border-outline-variant">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-surface-container p-1 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
                  onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                  title="Copy code"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
              <div className="bg-surface-container px-4 py-2 text-label-caps font-label-caps border-b border-outline-variant">
                {match[1]}
              </div>
              <SyntaxHighlighter
                {...props}
                style={materialLight}
                language={match[1]}
                PreTag="div"
                className="!bg-white !m-0 !p-4 !text-sm"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props} className="bg-surface-container-high text-primary px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-6 hard-shadow-sm border border-outline-variant rounded-xl">
              <table className="w-full text-left border-collapse">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return <th className="bg-surface-container p-3 border-b border-outline-variant text-label-caps font-bold">{children}</th>;
        },
        td({ children }) {
          return <td className="p-3 border-b border-outline-variant bg-white text-body-md">{children}</td>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
