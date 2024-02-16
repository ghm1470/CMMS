import {OrganizationDto} from '../../../../main-modules/basicInformation/organization/model/organizationDto';

export class SignUp {
  name: string;
  family: string;
  username: string;
  email: string;
  phone: string;
  organ: OrganizationDto.Create = new OrganizationDto.Create();
}
