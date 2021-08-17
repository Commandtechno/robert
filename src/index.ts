import client from "./client";

const $ = client();
export default Object.assign($, { client });