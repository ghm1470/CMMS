import {ResourcePage} from "./resource-page.model";
import {State} from "./state.model";

export class ResourceResponse {
  flag?: boolean;
  states?: State[];
  data?: any;
  page?: ResourcePage;

}
