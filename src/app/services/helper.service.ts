import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MESSAGE} from "../constants/message";
import {UserService} from "./user.service";
import {NotificationService} from "./notification.service";


@Injectable({
  providedIn: 'root'
})

export class HelperService {
  mywindow: any;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private notification: NotificationService,
  ) {
    this.mywindow = window;
  }

  async markFormGroupTouched(formGroup: any, ignoreFields: Array<string> = []) {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i) && formGroup.controls[i].enabled && !ignoreFields.includes(i)) {

        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();

      }
    }
    this.findInvalidControls(formGroup);
  }
  //
  //
  //
  // EnumToSelectList(key): Promise<ResponseData<any>> {
  //   const url = `${environment.SERVICE_API}/InitApp/EnumToSelectList?key=${key}`;
  //   return this.httpClient.get<ResponseData<any>>(url).toPromise();
  // }


  // dateValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
  //     return {invalid: true};
  //   }
  //   return;
  // };
  //
  // formatDate() {
  //   const datesCollection = (<HTMLCollection>document.getElementsByClassName('input-date'));
  //   let dates = Array.from(datesCollection);
  //
  //   dates.forEach(function (date) {
  //     new Cleave(date, {
  //       date: true,
  //       delimiter: '/',
  //       datePattern: ['d', 'm', 'Y'],
  //     })
  //   });
  // }

  SignFileCallBack1(rv: any) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
      location.reload()
    }
  }

  SignFileCallBack2(sender: any, rv: any) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
      console.log(received_msg.Signature);
    } else {
      alert("Ký số không thành công:" + received_msg.Status + ":" + received_msg.Error);
    }
  }

  replaceAll(string: any, search: any, replace: any) {
    return string.split(search).join(replace);
  }

  findInvalidControls(formData: any) {
    const invalid : string[] = [];
    const controls = formData.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      console.log(invalid, ' invalid');
    }
  }

  bidingDataInFormGroup(formGroup: FormGroup, dataBinding: any) {
    console.log(formGroup,dataBinding);
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }

  setIndexArray(array: any[]) {
    if (array && array.length > 0) {
      array.forEach((item, index) => {
        item.idx = index;
      })
    }
  }

  // public removeValidators(form: FormGroup) {
  //   for (const key in form.controls) {
  //     form.get(key).clearValidators();
  //   }
  // }

  async ignoreRequiredForm(formGroup: FormGroup, ignore?: any[]) {
    if (!ignore) {
      ignore = [];
    }
    for (let controlsKey in formGroup.controls) {
      const control = formGroup.controls[controlsKey];
      if (control.validator && !ignore.includes(controlsKey)) {
        control.setValidators(Validators.nullValidator);
      }
    }
  }

  async restoreRequiredForm(formGroup: FormGroup) {
    for (let controlsKey in formGroup.controls) {
      const control = formGroup.controls[controlsKey];
      if (control.validator) {
        control.setValidators(Validators.required);
      }
    }
  }

  bidingDataInFormGroupAndIgnore(formGroup: FormGroup, dataBinding: any, ignoreFields: Array<string> = []) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name) && !ignoreFields.includes(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }

  bidingDataInFormGroupAndNotTrigger(formGroup: FormGroup, dataBinding: any, fiedlNotTrigger: Array<string> = []) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name)) {
          if (fiedlNotTrigger.includes(name)) {
            formGroup.controls[name].setValue(dataBinding[name], {emitEvent: false});
          } else {
            formGroup.controls[name].setValue(dataBinding[name]);
          }
        }
      }
    }
  }

  encodeStringToBase64(input: string): string {
    return btoa(unescape(encodeURIComponent(input)));
  }

  decodeStringToBase64(input: string): string {
    return decodeURIComponent(escape(window.atob(input)));
  }

  // exc_check_digital_signatures(signCallBack) {
  //   let data = {
  //     test: "test"
  //   };
  //   this.exc_sign_xml(this, data, (sender, rv) => {
  //     var received_msg = JSON.parse(rv);
  //     if (received_msg.Status == 0) {
  //       this.exc_verify_xml(this.decodeStringToBase64(received_msg.Signature), (rv) => {
  //         signCallBack(JSON.parse(rv)[0].ValidationDetails.SignerCertStatus);
  //       });
  //     } else {
  //       alert("Ký số không thành công:" + received_msg.Status + ":" + received_msg.Error);
  //     }
  //   })
  // }

  // async check_certificate(userId: any, certificateNumber: any) {
  //   const url = `${environment.SERVICE_API}/qlnv-category/info-manage/check-certificate/${userId}/${certificateNumber}`;
  //   let res = await this.httpClient.get<any>(url).toPromise();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     return res.data;
  //   }
  //   return [];
  // }
  //
  // async create_certificate(data: any) {
  //   const url = `${environment.SERVICE_API}/qlnv-category/info-manage/create-certificate`;
  //   let res = await this.httpClient.post<any>(url, data).toPromise();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //   }
  // }
  //
  // exc_verify_xml(data, signCallBack) {
  //   var prms = {};
  //   prms["Data"] = data;
  //   prms["Format"] = "XML";
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_verify_xml(json_prms, signCallBack);
  // }
  //
  // // Lãnh đạo ký phê duyệt
  // exc_sign_approved(data, idVanBan, type, userName) {
  //   var prms = {};
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${1}&userName=${userName}&fileId=${data.id}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_sign_file(json_prms, this.SignFileCallBack1);
  //
  // }
  //
  // // Ký nháy
  // exc_sign_approved_kynhay(data, idVanBan, type, userName) {
  //   var prms = {};
  //   var scv = [{"Key": "abc", "Value": "abc"}];
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${3}&userName=${userName}&fileId=${data.id}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //   prms["MetaData"] = scv;
  //   var json_prms = JSON.stringify(prms);
  //   // this.mywindow.vgca_sign_file(json_prms, this.SignFileCallBack1);
  //   this.mywindow.vgca_sign_file(json_prms, this.SignFileCallBack1);
  //
  //   //vgca_sign_file(json_prms, SignFileCallBack1);
  //
  // }
  //
  // // Văn thư ký phát hành
  // exc_sign_issued(data, idVanBan, type, userName) {
  //   var prms = {};
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${2}&userName=${userName}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //   prms["DocNumber"] = "123";
  //   prms["IssuedDate"] = new Date();
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_sign_file(json_prms, this.SignFileCallBack1);
  //
  // }
  //
  // // Văn thư ký công văn đến
  // vgca_sign_income(data, idVanBan, type, userName) {
  //   var prms = {};
  //   var scv = [];
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&userName=${userName}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //   prms["MetaData"] = scv;
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_sign_file(json_prms, this.SignFileCallBack1);
  //
  // }
  //
  // // Add Comment
  // exc_comment(data, idVanBan, type) {
  //   var prms = {};
  //   var scv = [{"Key": "abc", "Value": "abc"}];
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //   prms["MetaData"] = scv;
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_comment(json_prms, this.SignFileCallBack1);
  // }
  //
  // // Ký tài liệu đính kèm
  // exc_appendix(data, idVanBan, type) {
  //   var prms = {};
  //   var scv = [{"Key": "abc", "Value": "abc"}];
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
  //   prms["DocNumber"] = "123/BCY-CTSBMTT";
  //   prms["MetaData"] = scv;
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_sign_appendix(json_prms, this.SignFileCallBack1);
  // }
  //
  // // Sao văn bản điện tử
  // exc_sign_copy(data, idVanBan, type) {
  //   var prms = {};
  //   var scv = [{"Key": "abc", "Value": "abc"}];
  //
  //   prms["FileUploadHandler"] = `${environment.SERVICE_API}/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
  //   prms["SessionId"] = "";
  //   prms["FileName"] = `${environment.SERVICE_API}/QuanLyFilesServer/DownloadFilePdfPdf?fileId=${data.id}`;
  //   prms["DocNumber"] = "123/BCY-CTSBMTT";
  //   prms["MetaData"] = scv;
  //
  //   var json_prms = JSON.stringify(prms);
  //   this.mywindow.vgca_sign_copy(json_prms, this.SignFileCallBack1);
  // }
  //
  // convertSlug(str) {
  //   str = str.replace(/^\s+|\s+$/g, ''); // trim
  //   str = str.toLowerCase();
  //
  //   // remove accents, swap ñ for n, etc
  //   var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  //   var to = "aaaaaeeeeeiiiiooooouuuunc------";
  //   for (var i = 0, l = from.length; i < l; i++) {
  //     str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  //   }
  //
  //   str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
  //     .replace(/\s+/g, '-') // collapse whitespace and replace by -
  //     .replace(/-+/g, '-'); // collapse dashes
  //
  //   return str;
  // }
}
