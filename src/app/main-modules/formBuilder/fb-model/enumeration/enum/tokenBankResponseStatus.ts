export enum TokenBankResponseStatus {
  CanceledByUser = <any> 'کاربر انصراف داده است.',
  OK = <any> 'پرداخت با موفقیت انجام شد.',
  Failed = <any> 'پرداخت انجام نشد.',
  SessionIsNull = <any> 'کاربر در بازه زمانی اعلام شده پاسخی ارسال نکرده است.',
  InvalidParameters = <any> 'پارمتر های ارسالی نامعتبر',
  MerchantIpAddressIsInvalid = <any> 'آدرس سرور پذیرنده نا معتبر است (در پرداخت های بر پایه توکن)',
  TokenNotFound = <any> 'توکن ارسال شده یافت نشد.',
  TokenRequired = <any> 'با این شماره ترمینال فقط تراکنش های توکنی قابل پرداخت هستند.',
  TerminalNotFound = <any> 'شماره ترمینال ارسال شده یافت نشد.',
  RefNum_Is_Not_Unique = <any> 'با این شماره قبلا تراکنش دیگری انجام شده است.',
  Something_Wrong = <any> 'خطایی رخ داده است.'
}

