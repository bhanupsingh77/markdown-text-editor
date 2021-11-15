import { ContentRecordDAC } from "@skynetlabs/content-record-library";
import { SkynetClient } from "skynet-js";
//enviornment variables

// development or production setter
const dev = window.location.href.includes("localhost") ? true : false;

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const PORTAL = "https://siasky.net/"; // allow for developing on localhost
export const CLIENT = dev ? new SkynetClient(PORTAL) : new SkynetClient();
export const CONTENT_RECORD = new ContentRecordDAC();

//app base file path (version one)
export const DATA_DOMAIN = dev ? "localhost" : "skycolab.hns/v1";
