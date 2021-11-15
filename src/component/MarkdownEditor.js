import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  mySkyWriteEncryptedJsonFile,
  mySkyReadEncryptedJsonFile,
  MYSKY_DOC_FILE_PATH,
  MYSKY_DOC_FILE_NUMBER_PATH,
} from "../utils/skynet-utils";

function MarkdownEditor({
  mySky,
  openSavedDoc,
  setActiveComponent,
  setOpenSavedDoc,
}) {
  const [loadingMdEditor, setloadingMdEditor] = useState(false);
  const [markdownText, setMarkdownText] = useState("");
  const [firstTimeDocSave, setFirstTimeDocSave] = useState({
    save: false,
    data: null,
  });

  useEffect(() => {
    setloadingMdEditor(true);
    async function checkExistingFile() {
      if (openSavedDoc.open) {
        setMarkdownText(openSavedDoc.docData.data);
      }
    }
    checkExistingFile();
    setloadingMdEditor(false);
  }, []);

  const onNewDocumentSave = async (markdownText) => {
    setloadingMdEditor(true);
    const lastFileNumber = await mySkyReadEncryptedJsonFile(
      mySky,
      MYSKY_DOC_FILE_NUMBER_PATH
    );
    if (lastFileNumber) {
      const { fileNumber } = lastFileNumber;
      const updatedFileNumber = fileNumber + 1;
      const docData = {
        id: updatedFileNumber,
        name: `newdoc_${updatedFileNumber}`,
        data: markdownText,
      };
      await mySkyWriteEncryptedJsonFile(
        mySky,
        { fileNumber: updatedFileNumber },
        MYSKY_DOC_FILE_NUMBER_PATH
      );
      const filePath = MYSKY_DOC_FILE_PATH + "/" + updatedFileNumber;
      await mySkyWriteEncryptedJsonFile(mySky, docData, filePath);
      setFirstTimeDocSave({ save: true, data: docData });
    } else {
      //first file doc save
      const docData = {
        id: 1,
        name: `newdoc_1`,
        data: markdownText,
      };
      await mySkyWriteEncryptedJsonFile(
        mySky,
        { fileNumber: 1 },
        MYSKY_DOC_FILE_NUMBER_PATH
      );
      const filePath = MYSKY_DOC_FILE_PATH + "/1";
      await mySkyWriteEncryptedJsonFile(mySky, docData, filePath);
      setFirstTimeDocSave({ save: true, data: docData });
    }

    setloadingMdEditor(false);
  };

  const onExistingDocumentSave = async (markdownText) => {
    setloadingMdEditor(true);
    if (firstTimeDocSave.save) {
      const filePath = MYSKY_DOC_FILE_PATH + "/" + firstTimeDocSave.data.id;
      const docData = {
        id: firstTimeDocSave.data.id,
        name: `newdoc_${firstTimeDocSave.data.id}`,
        data: markdownText,
      };
      await mySkyWriteEncryptedJsonFile(mySky, docData, filePath);
    } else {
      const docData = {
        id: openSavedDoc.docData.id,
        name: `newdoc_${openSavedDoc.docData.id}`,
        data: markdownText,
      };

      const filePath = MYSKY_DOC_FILE_PATH + "/" + openSavedDoc.docData.id;
      await mySkyWriteEncryptedJsonFile(mySky, docData, filePath);
    }
    setloadingMdEditor(false);
  };
  return (
    <>
      {loadingMdEditor ? (
        <div className="h-screen flex items-center justify-center">
          <div
            style={{ borderTopColor: "#374785" }}
            className="h-16 w-16 border-4 border-solid border-gray-100 rounded-full animate-spin"
          ></div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col">
          <div
            style={{ height: "5%", backgroundColor: "#24305E" }}
            className="flex items-center justify-between"
          >
            <button
              style={{ backgroundColor: "#A8d0e6" }}
              className="m-4 h-8 w-20 shadow text-xl text-black font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
              onClick={() => {
                setActiveComponent("app");
                setOpenSavedDoc({ open: false, docData: null });
              }}
            >
              Back
            </button>
            <p className="text-xl font-mono font-bold text-white">
              {" "}
              Markdown Text Editor
            </p>
            <button
              style={{ backgroundColor: "#A8d0e6" }}
              className="m-4 h-8 w-20 shadow text-xl text-black font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
              onClick={() =>
                openSavedDoc.open || firstTimeDocSave.save
                  ? onExistingDocumentSave(markdownText)
                  : onNewDocumentSave(markdownText)
              }
            >
              Save
            </button>
          </div>
          <div
            style={{ height: "95%" }}
            className="flex justify-between overflow-hidden"
          >
            <div className="w-1/2">
              <p
                className="m-0 p-0 border-4 border-solid border-gray-300 bg-gray-100 text-2xl text-center align-middle capitalize font-semibold font-mono"
                style={{ height: "4%" }}
              >
                Markdown Text
              </p>
              <textarea
                className="w-full border-4 border-solid border-black text-xl"
                style={{ height: "93.5%", width: "98%" }}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <p
                className="m-0 p-0 border-4 border-solid border-gray-300 bg-gray-100 text-2xl text-center align-middle capitalize font-semibold font-mono"
                style={{ height: "4%" }}
              >
                Converted Text
              </p>
              <div
                className="w-full border-4 border-solid border-black text-xl overflow-scroll overflow-hidden "
                style={{ height: "94%", width: "98.5%" }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownText}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default MarkdownEditor;
