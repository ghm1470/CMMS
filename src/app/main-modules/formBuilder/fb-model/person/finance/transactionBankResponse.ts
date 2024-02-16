import {TokenBankResponseStatus} from '../../enumeration/enum/tokenBankResponseStatus';
import {PaymentStatus} from '../../enumeration/enum/paymentStatus';


export class TransactionBankResponse {
  id: string;
  amount: number;
  bankStatus: TokenBankResponseStatus;
  comment: string;
  date: any;
  paymentStatus: PaymentStatus;
  personId: string;
  personName: string;
  planId: string;
  refNum: string;
  time: any;
  traceNo: string;
}
