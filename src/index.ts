import client from "./client";
import { Client, Options } from "./types/client";

interface Robert extends Client {
  client(options: Options): Client;
}

const robert: Robert = Object.assign(client(), { client });
export default robert;