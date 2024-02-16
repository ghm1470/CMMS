import {LightPerson} from '../light-person';
import {SignerConfirmStatus} from '../../enumeration/enum/signerConfrimStatus';


export class Certificate {
  hasCertificate = false;
  certificateContext: string;
  certificateSigner: LightPerson;
  signerConfirmStatus: SignerConfirmStatus;
}
