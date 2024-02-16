
export class MyPattern {
  public static email = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
  public static phone = '(([0]+[9])([0-9]{9})||([۰]+[۹])([۰-۹]{9}))$';
  public static tell = '(([0])([0-9]{10})||([۰])([۰-۹]{10}))$';
  public static nationalCode = '(([0-9]{10})||([۰-۹]{10}))$';
  public static faText = '[آ-ی ]+';
  public static date = '^(([0-9]{1})([.,\/]([0-9]{1,2})){0,1}|([۰-۹]{1})([.,\/]([۰-۹]{1,2})){0,1})';
  public static streetName = '[۰-۹-0-9آ-ی ]+';
  public static bankCard = '((([1-9])([0-9]{18})||([۱-۹])([۰-۹]{18}))||(([1-9])([0-9]{15})||([۱-۹])([۰-۹]{15})))$';
  public static shabaNumber = '(([1-9])([0-9]{23})||([۱-۹])([۰-۹]{23}))';
  public static bcNumber = '([1-9]{1}||[1-9]+[0-9]+||[۱-۹]{1}||[۱-۹]+[۰-۹]+)$'; // شماره شناسنامه
  public static password = '[-_/@!#$%^&*().A-Za-z0-9]+';
  public static smartCode = '[-_/@!#$%^&*().A-Za-z0-9۰-۹]+';
  public static userName = '[_.A-Za-z0-9]{3,20}$';
  public static userName2 = '[_A-Za-z0-9]+';
  public static number = '^([0-9]*)$|^([۰-۹]*)$';
  public static EnNumber = '^([0-9]*)$';
  public static FaNumber = '^([۰-۹]*)$';
  public static faNumberAndText = '[۰-۹]*|[آ-ی ]*';
  public static postalCode = '((([1-9]{1})([0-9]{9}))||(([۱-۹]{1})([۰-۹]{9})))$';
  public static nameAndFamily = '([ آ-ی ]+)+([ آ-ی ])';
  public static EnNumberAndAlphabetic = '^([A-Za-z0-9]*)$';

  public static keyWord = '[آ-ی ]+[()_.A-Za-z0-9-۰-۹-0-9آ-ی]+';

  public static WEBSITE_ADDRESS = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$';

  public static EMAIL = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public static OBJECT_ID = '^[0-9a-fA-F]{24}$';
  public static USERNAME = '^[A-Za-z0-9_]{6,30}$';
  public static PASSWORD = '^[A-Za-z0-9_!@#$&*]{6,30}$';
  public static CodeSmsNumber = '^([0-9]{6})$';
  public static KEY = '^[A-Z_]{4,999}$';
  public static PROJECT_KEY = '[A-Z_]{4,30}_PROJECT$';
  public static RESET_PASSWORD_TOKEN = '^[A-Za-z0-9]{20}$';
  public static MOBILE_HOME_TEL = '(([0])([0-9]{10})||([۰])([۰-۹]{10}))$';
  public static UUID2 = '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}';
  public static TITLE = '^[A-Za-z' + 'آ-ی' + '0-9_ -]{1,100}$';
  public static TITLEFa = "^[A-Za-z" + "آ-ی" + '0-9۰-۹_ -]{1,50}$';
  public static FA_NAME = '^[' + 'آ-ی' + ']{2,50}$';
  // public static faAndEnText = '[آ-ی a-zA-Z]+';
  public static faAndEnText = '^[A-Za-z' + 'آ-ی' + '0-9۰-۹_ -]{1,500}$';
  public static EnText = '^[A-Za-z' +  '_ -]{1,500}$';
  public static NAMEANDFAMILY =  "^[A-Za-z" + "آ-ی" + '0-9۰-۹_ -]{1,50}$';
  public static faOrEnNameAndFamily = '([ A-Za-z ]+)|([ آ-ی ]+)+([ آ-ی ])';  /// فارسی یا انگلیسی
}
