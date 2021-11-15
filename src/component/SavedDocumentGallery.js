import { useState, useEffect } from "react";
import {
  mySkyWriteEncryptedJsonFile,
  mySkyReadEncryptedJsonFile,
  MYSKY_DOC_FILE_PATH,
  MYSKY_DOC_FILE_NUMBER_PATH,
} from "../utils/skynet-utils";

function SavedDocumentGallery({ mySky, setOpenSavedDoc, setActiveComponent }) {
  const [docGalleryData, setDocGalleryData] = useState([]);
  const [loadingDocGalleryData, setLoadingDocGalleryData] = useState(false);

  //   const getDocGalleryData = async (fileNumber) => {
  //     return docFilesArray;
  //   };
  const openSavedDoc = (openedDocData) => {
    setOpenSavedDoc({ open: true, docData: openedDocData });
    setActiveComponent("markdownEditor");
  };
  useEffect(() => {
    setLoadingDocGalleryData(true);
    async function initialDocGalleryData() {
      const lastFileNumber = await mySkyReadEncryptedJsonFile(
        mySky,
        MYSKY_DOC_FILE_NUMBER_PATH
      );
      if (lastFileNumber) {
        const { fileNumber } = lastFileNumber;
        //   const c = await getDocGalleryData(fileNumber);
        const docFilesArray = new Array(fileNumber).fill(fileNumber);
        const finalDocFilesArray = await Promise.all(
          docFilesArray.map((element, index) =>
            (async (_) => {
              const filePath = MYSKY_DOC_FILE_PATH + "/" + (index + 1);
              const data = await mySkyReadEncryptedJsonFile(mySky, filePath);
              return data;
            })()
          )
        );
        setDocGalleryData(finalDocFilesArray);
      }
      setLoadingDocGalleryData(false);
    }
    initialDocGalleryData();
  }, [mySky]);

  return (
    <div className="m-4 flex flex-wrap">
      {loadingDocGalleryData ? (
        <div>
          {" "}
          <div
            style={{ borderTopColor: "#374785" }}
            className="h-16 w-16 border-4 border-solid border-gray-100 rounded-full animate-spin"
          ></div>
        </div>
      ) : !docGalleryData.length ? (
        <div>No saved file</div>
      ) : (
        <div className="w-screen h-96 flex justify-center">
          <div className="w-5/6 p-2 overflow-auto border-2 border-solid border-black rounded shadow-xl flex flex-wrap justify-center">
            {docGalleryData.map((e, i) => {
              if (e) {
                return (
                  <div
                    key={e.name}
                    className="m-2 p-2 h-20 w-44 border border-solid shadow rounded"
                  >
                    <div className="m-1 mb-2 flex justify-around font-mono text-xl">
                      <p className="m-0">{e.name}</p>
                      <p className="m-0">Id:{e.id}</p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        style={{ backgroundColor: "#A8d0e6" }}
                        className="h-8 w-20 shadow text-xl text-white font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
                        onClick={() => openSavedDoc(e)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedDocumentGallery;
