export * from "./types";

import client from "./client";
export default Object.assign(client(), { client });
