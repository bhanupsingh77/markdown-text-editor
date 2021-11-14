import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownEditor() {
  const [markdownText, setMarkdownText] = useState("");

  return (
    <div className="h-1/2 flex justify-between border-2 border-blue-300">
      <textarea
        className="border-2 w-1/2 "
        value={markdownText}
        onChange={(e) => setMarkdownText(e.target.value)}
      />
      <div className="border-2  w-1/2 ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdownText}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownEditor;
