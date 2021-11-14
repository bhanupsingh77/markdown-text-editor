import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownEditor() {
  const [markdownText, setMarkdownText] = useState("");

  return (
    <div className="h-full w-full flex justify-between overflow-hidden">
      <div className="w-1/2">
        <p
          className="m-0 p-0 border-4 border-solid border-gray-300 bg-gray-100 text-2xl text-center capitalize font-semibold font-mono"
          style={{ height: "6%" }}
        >
          Markdown Text
        </p>
        <textarea
          className="w-full border-4 border-solid border-black text-xl"
          style={{ height: "92.2%", width: "98%" }}
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
        />
      </div>
      <div className="w-1/2">
        <p
          className="m-0 p-0 border-4 border-solid border-gray-300 bg-gray-100 text-2xl text-center capitalize font-semibold font-mono"
          style={{ height: "6%" }}
        >
          Converted Text
        </p>
        <div
          className="w-full border-4 border-solid border-black text-xl overflow-scroll overflow-hidden "
          style={{ height: "92.5%", width: "98.5%" }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default MarkdownEditor;
