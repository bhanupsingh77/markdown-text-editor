import { DATA_DOMAIN } from "./skynet-ev";

//skynet file paths
export const MYSKY_DOC_FILE_PATH = DATA_DOMAIN + "/doc";
export const MYSKY_DOC_FILE_NUMBER_PATH = DATA_DOMAIN + "/docnumber";

// skynet operation functions

export async function mySkyReadEncryptedJsonFile(mySky, filePath) {
  try {
    // Get encrypted JSON data from the given path.
    const { data } = await mySky.getJSONEncrypted(filePath);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function mySkyWriteEncryptedJsonFile(mySky, jsonData, filePath) {
  try {
    // Set encrypted JSON data at the given path. The return type is the same as getJSONEncrypted.
    await mySky.setJSONEncrypted(filePath, jsonData);
  } catch (error) {
    console.log(error);
  }
}

export function mySkyDeleteJsonFile() {}

export function mySkyUpdateJsonFile() {}

export async function handleMySkyLogin(mySky, dispatch) {
  // Try login again, opening pop-up. Returns true if successful
  const status = await mySky.requestLoginAccess();

  if (status) {
    const userID = await mySky.userID();
    dispatch({
      type: "updateField",
      fieldName: "userID",
      value: userID,
    });
  }
  dispatch({
    type: "updateField",
    fieldName: "loggedIn",
    value: status,
  });
}

export async function handleMySkyLogout(mySky, dispatch) {
  // call logout to globally logout of mysky
  await mySky.logout();

  //set react state
  dispatch({
    type: "updateField",
    fieldName: "loggedIn",
    value: false,
  });
  dispatch({
    type: "updateField",
    fieldName: "userID",
    value: "",
  });
}
