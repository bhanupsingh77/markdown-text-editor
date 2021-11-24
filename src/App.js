import { useEffect, useState, useReducer } from "react";

import MarkdownEditor from "./component/MarkdownEditor.js";
import SavedDocumentGallery from "./component/SavedDocumentGallery.js";

import { CLIENT, CONTENT_RECORD, DATA_DOMAIN } from "./utils/skynet-ev.js";
import { handleMySkyLogin, handleMySkyLogout } from "./utils/skynet-utils.js";

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case "updateField":
      return {
        ...prevState,
        [action.fieldName]: action.value,
      };
    default:
      throw new Error(`unknown action type ${action.type}`);
  }
};
function App() {
  const [mySky, setMySky] = useState();
  const [activeComponent, setActiveComponent] = useState("app");
  const [openSavedDoc, setOpenSavedDoc] = useState({
    open: false,
    docData: null,
  });
  const [state, dispatch] = useReducer(stateReducer, {
    loggedIn: false,
    userID: null,
    loadingMySky: true,
  });
  // On initial run, start initialization of MySky
  useEffect(() => {
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await CLIENT.loadMySky(DATA_DOMAIN);

        // load necessary DACs and permissions
        await mySky.loadDacs(CONTENT_RECORD);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        setMySky(mySky);
        dispatch({
          type: "updateField",
          fieldName: "loggedIn",
          value: loggedIn,
        });

        if (loggedIn) {
          const userID = await mySky.userID();
          dispatch({
            type: "updateField",
            fieldName: "userID",
            value: userID,
          });
        }

        dispatch({
          type: "updateField",
          fieldName: "loadingMySky",
          value: false,
        });
      } catch (e) {
        alert(e);
        console.error(e);
      }
    }

    initMySky();
  }, []);

  if (activeComponent === "app") {
    return (
      <div>
        {state.loadingMySky ? (
          <div className="h-screen flex items-center justify-center">
            <div
              style={{ borderTopColor: "#374785" }}
              className="h-16 w-16 border-4 border-solid border-gray-100 rounded-full animate-spin"
            ></div>
          </div>
        ) : state.loggedIn ? (
          <div>
            <div
              style={{ backgroundColor: "#24305E" }}
              className="px-4 pl-14 flex justify-between items-center shadow-xl"
            >
              <h1 className="font-mono text-white text-lg sm:text-4xl">
                Markdown Text Editor
              </h1>

              <button
                style={{ backgroundColor: "#A8d0e6" }}
                className="m-2 h-12 w-28 shadow text-xl font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
                onClick={() => handleMySkyLogout(mySky, dispatch)}
              >
                Logout
              </button>
            </div>
            <div>
              <p className="ml-8 inline-block text-2xl font-bold font-mono">
                Create :{" "}
              </p>
              <button
                style={{ backgroundColor: "#A8d0e6" }}
                className="m-4 h-12 w-60 shadow text-xl text-white font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
                onClick={() => setActiveComponent("markdownEditor")}
              >
                New Markdown Doc
              </button>
            </div>
            <hr></hr>
            <div className="flex flex-col items-center">
              <h2 className="font-mono text-3xl">My Markdown Documents</h2>
              <SavedDocumentGallery
                mySky={mySky}
                setOpenSavedDoc={setOpenSavedDoc}
                setActiveComponent={setActiveComponent}
              />
            </div>
            <hr />
            <div className="flex justify-center">
              <a
                className="mt-4 p-1 px-4 border-2 border-solid border-gray-500 hover:border-gray-900 rounded text-xl text-white bg-black"
                href="https://github.com/bhanupsingh77/markdown-text-editor"
                target="_blank"
              >
                Github repo
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center">
            <h1 className="font-mono">Markdown Text Editor</h1>
            <button
              style={{ backgroundColor: "#A8d0e6" }}
              className="m-2 h-12 w-28 shadow text-xl font-semibold font-mono border-2 border-solid border-blue-100 rounded cursor-pointer hover:border-blue-300"
              onClick={() => handleMySkyLogin(mySky, dispatch)}
            >
              Login
            </button>
            <a
              className="mt-4 p-1 px-4 border-2 border-solid border-gray-500 hover:border-gray-900 rounded text-xl text-white bg-black"
              href="https://github.com/bhanupsingh77/markdown-text-editor"
              target="_blank"
            >
              Github repo
            </a>
          </div>
        )}
      </div>
    );
  }

  if (activeComponent === "markdownEditor") {
    return (
      <div className="h-screen w-screen">
        <MarkdownEditor
          mySky={mySky}
          openSavedDoc={openSavedDoc}
          setActiveComponent={setActiveComponent}
          setOpenSavedDoc={setOpenSavedDoc}
        />
      </div>
    );
  }
}

export default App;
