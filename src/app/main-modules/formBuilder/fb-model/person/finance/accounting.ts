import {TokenBankResponseStatus} from '../../enumeration/enum/tokenBankResponseStatus';
import {PaymentStatus} from '../../enumeration/enum/paymentStatus';


export class Accounting {
  id: string;
  price: number;
  date: string;
  ownerId: string;
  resNum: string; // کد منحصر به فرد تولید شده توسط برنامه خودمان
  refNum: string; // کد تولید شده توسط بانک برای یک تراکنش
  bankState: TokenBankResponseStatus;
  status: PaymentStatus;
  traceNo: number;
}
