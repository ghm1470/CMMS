declare const $: any;
export class Notifyme {
  public static showNotify(from, align, type, msg){
    $.notify({
      message: msg,
    }, {
      placement: {from, align},
      offset: {x: 20, y: 35},
      type,
      template: `<div class="alert alert-{0} alert-with-icon col-md-4">
          <button class="close" type="button" data-dismiss="alert" aria-label="Close">
            <i class="material-icons" style="font-size:large; color: black">close</i>
          </button>
          <span>{2}</span>
        </div>`
    });
  }
}
