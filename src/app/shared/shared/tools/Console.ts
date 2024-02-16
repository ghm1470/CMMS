export class Console {
  public static consoleBool = false;

  public static log(subject: any, body: any) {
    if (Console.consoleBool) {
    }
  }

  public static error(subject: any, body: any) {
    if (Console.consoleBool) {
      console.error(subject, body);
    }
  }
}
