import {Api} from "@/api/gen/Api.ts";

export const BaseURL = "http://localhost:3000";

const Client = new Api({baseUrl: BaseURL});
export default Client;
