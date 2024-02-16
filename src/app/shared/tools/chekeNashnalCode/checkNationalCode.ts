
export class CheckNationalCode {

  public static check(nationalCode) {
    const fakeCode = ['0000000000', '1111111111', '2222222222', '3333333333',
      '4444444444', '5555555555', '6666666666', '7777777777', '8888888888', '9999999999'];
    const Arr = Array.from(nationalCode);
    if (fakeCode.some(e => e === nationalCode)) {
        return false;
      } else if (Arr.length !== 10) {
        return false;
      } else {
        let Sum = 0;
        let Last;
        for (let i = 0; i < 9; i++) {
          Sum += +Arr[i] * (10 - i);
        }
        const divideRemaining = Sum % 11;
        if (divideRemaining < 2) {
          Last = divideRemaining;
        } else {
          Last = 11 - (divideRemaining);
        }
        const n = Arr[9];
        return Last == n;
      }
    }
}
