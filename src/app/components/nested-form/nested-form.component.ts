import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';


declare  let BrowserPrint:  any;

@Component({
  selector: 'app-nested-form',
  templateUrl: './nested-form.component.html',
  styleUrls: ['./nested-form.component.css']
})
export class NestedFormComponent implements OnInit {

  labelsForm: FormGroup;
  myVal: boolean = false;
  myArr: any = [];
  url = 'http://192.168.3.6:3000/generateLabel';
  // apiEndPoint: any = `http://172.24.2.80:8086/`;
  apiEndPoint: any = `http://192.168.2.120:8086/`;
  blobSrc: any;
  width: any = '4';
  height: any = '1';
  printDensity: any = '8';

  dalBrandSKU: any = [];
  levels: any = [];
  versions: any = [];
  dalEncryptions: any = [];

  brandSKU: any;
  level: any;
  version: any;
  dalEncryption: any;
  formatName: any;
  zplCode: any;

  carryingCapacity: any;
  batch: any;
  mfg: any;
  expiry: any;
  noOfCodes: any;

  selectedFormat: any;
  qrCodes: any = [];
  batchCodes: any = [];
  finalFullCodeZpl: any;
  myInterval: any;

  constructor(
      private fb: FormBuilder,
      private _sanitizer: DomSanitizer,
      private toaster: ToastrService
    ) { 
      for(let i=0; i < 10; i++) {
        this.batchCodes.push({
        'id': i+1,
        'qrCode': Math.random().toString(36).substring(2,12).toUpperCase(),
        'cName': 'DHANUKA',
        'mfgDate' : '2019/11',
        'expDate': '2020/11'
        })
      }
    }

  ngOnInit() {
    this.labelsForm = this.fb.group({
      labels: new FormArray([])
    });
    // this.getDalBrandSKU();
    // this.getLevels();
    // this.getVersions();
    // this.getDalEncryptions();
    // this.getAllQRCodes();
  }

  async getDalBrandSKU() {
    try { 
      let response = await fetch(this.apiEndPoint+'dal/dalBrandAndSku/all', {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json.content, "PPP");
      this.dalBrandSKU = json.content;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getLevels() {
    try {
      let response = await fetch(this.apiEndPoint+'dal/levelVersion/levels', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      this.levels = json;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getVersions() {
    try {
      let response = await fetch(this.apiEndPoint+'dal/levelVersion/versions', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      this.versions = json
    }catch(error) {
      console.log('Error:', error);
    }
  }

  async getDalEncryptions() {
    try {
      let response = await fetch(this.apiEndPoint+'dal/dalEncryption/all', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      this.dalEncryptions = json
    }catch(error) {
      console.log('Error:', error);
    }
  }

  async saveZPLCode() {
    if(!this.zplCode || !this.formatName) {
      alert('Please fill all the fields!');
      return;
    }
    let data = {
        formatData: {
        zplCode: this.zplCode,
        formatName: this.formatName
      }
    }
    console.log(data,"pp")
    try { 
      let response = await fetch(this.apiEndPoint+'dal/qrFormat/create', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      this.getAllQRCodes();
      if(json.id) {
        // setTimeout(()=> {
        // },4000);
        this.zplCode = '';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  testPrint() {

    var zpl = "^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ"
    
    // var printWindow = window.open();
    // printWindow.document.open('text/plain')
    // printWindow.document.write(zpl);
    // printWindow.document.close();
    // printWindow.focus();
    // printWindow.print();
    // printWindow.close();
 
    // var ip_addr = "http://localhost:9100/write"
  // var output = document.getElementById("output");
  // var url = "http://localhost:9100/write";
  // var method = "POST";
  // var async = true;
  // var request = new XMLHttpRequest();

  // request.onload = function () {
  //   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
  //   var data = request.responseText; // Returned data, e.g., an HTML document.
  //   output.innerHTML = "Status: " + status + "<br>" + data;
  // }

  // request.open(method, url, async);
  // // request.setRequestHeader("Content-Length", zpl.length);

  // // Actually sends the request to the server.
  // request.send(zpl)
    let self = this;
    self.zplCode = '^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ'
    
    BrowserPrint.getDefaultDevice('printer', function(printer: any) {
      console.log(printer)
      printer.send(
        self.zplCode
      )
    },function(error_response :any) {
      console.log(error_response);
    });
    // wi
  }

  // convenience getters for easy access to form fields
  get f() { return this.labelsForm.controls; }
  get t() { return this.f.labels as FormArray; }

  onChangelabels(e: any) {
    console.log(e.value);
    this.labelsForm.reset();
    let noOfLabels = Number(e.value) || 0;
    if(this.t.length < noOfLabels) {
      for(let i = this.t.length; i < noOfLabels; i++) {
        this.t.push(this.fb.group({
          Codes: new FormArray([])
        }))
      }
    }else {
      for (let i = this.t.length; i >= noOfLabels; i--) {
          this.t.removeAt(i);
      }
    }
    console.log(this.labelsForm, "Uma")
  }

  AddNew() {
    console.log('add new got clicked!');
    console.log(this.labelsForm.controls.labels.value, "PPPP");
    let x = this.labelsForm.controls.labels.value
    for(let i=0 ; i < x.length; i++) {
      x[i].Codes.push({
        textWeight: '',
        size: '',
        x: '20',
        y: '20',
        type: '^FD',
        text: '',
        length: '30',
        breadth: '50',
        textOrientation: '^FWN'
      })
    }
    this.myVal = true;
    this.myArr = this.labelsForm.controls.labels.value;
  }

  call(l: any) {
    console.log(l);
  }
  
  generateZpl() {
    let str = '^XA \n'
    this.myArr.map((x: { Codes: any; },i: any)=> {
      console.log(x);
      let c = x.Codes;
      str += `^FX`
      c.map((y: any,j: any)=> {
        console.log(y);
        if(y.type == '^FD') { // text
          str += y.textWeight+','+y.size
          str += '^FO'+y.x+','+y.y
          str += y.textOrientation+'^FD'+y.text+'^FS'
        }
        if(y.type == '^BQ,2') { //QR Code 
          str += '^FO'+y.x+','+y.y+y.type+','+y.textWeight
          str += '^FD'+y.size+'A,'+y.text+'^FS'
        }
        if(y.type == '^GB') {
          str += '^FO'+y.x+','+y.y+y.type+y.length+','+y.breadth+','+y.textWeight+'^FS'
        }
        if(y.type == '^BXN') {
          str += '^FO'+y.x+','+y.y+y.type+','+y.textWeight+','+y.size+'^FD'+y.text+'^FS'
        }
      })
    })
    str += `^FX`
    str +='^XZ'
      
    console.log(str, "::::::Uma:::::::");
    this.zplCode = str;
    this.callApi(str);
  }

  async  callApi(code: any) {
    // alert(1);
    let data = { 
      zpl: code,
      width: this.width,
      height: this.height,
      density: 8 
    };

    try { 
      let response = await fetch(this.url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      let base64 = btoa(new Uint8Array(json.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      // console.log(base64);
      this.blobSrc = this._sanitizer.bypassSecurityTrustUrl('data:application/octet-stream;base64,'+ base64);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async generateQRCode() {
    let data = {
      "batch": this.batch,
      "mfd": this.mfg,
      "expiry": this.expiry,
      "carryingCapacity": Number(this.carryingCapacity),
      "dalPackLevel": this.level,
      "dalCodeVersion": this.version,
      "dalBrandAndSkuId": this.brandSKU,
      "numberOfCodes": Number(this.noOfCodes),
      "dalEncryptionId": Number(this.dalEncryption)
    }
    console.log(data);
    try {
      let response = await fetch(this.apiEndPoint+'dal/dalQRInformation/generateQRCode', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      this.toaster.success(json.message);
    }catch(error) {
      console.log('Error:',error)
    }
  }

  async getQRCodes() {
    let data = {
      "batch": this.batch,
      "dalBrandAndSkuId": this.brandSKU,
      "statusId":2,
      "dalEncryptionId": Number(this.dalEncryption),
      "dalPackLevel":  this.level,
      "dalCodeVersion": this.version
    }
    try {
      let response = await fetch(this.apiEndPoint+'dal/dalQRInformation/all', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      this.batchCodes = json.content;
      this.batchCodes.map((b: any,j: any)=> {
        b['cName'] = 'Dhanuka'
      })
      // this.toaster.success(json.message);
      console.log(json, "PPP");
    }catch(error) {
      console.log('Error:',error)
    }
  }

  async getAllQRCodes() {
    try {
      let response = await fetch(this.apiEndPoint+'dal/qrFormat/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json);
      this.qrCodes = json.content;
    } catch(error) {
      console.log(error)
    }
  }

  currentSelectedFormat(e :any) {
    console.log(e);
    this.qrCodes.map((q: any,i: any)=>{
      if(e.value == q.id) {

        this.selectedFormat = (q.formatData.zplCode).split('^FX');
        let zpl: any  = this.selectedFormat[0];
        
        for(let i = 1; i < (this.selectedFormat.length -1); i++) {
          let str: string = '';
          str = this.selectedFormat[i];
          let x = `${ (i-1) != 0 ? '+'+(i-1) : ''}`;
          str = this.replaceAll(str, 'cName', '${qrCodes[i'+((Number(x) !== 0) ? x : '')+'].cName}')
          str = this.replaceAll(str, 'expDate', '${qrCodes[i'+((Number(x) !== 0) ? x : '')+'].expiry}')
          str = this.replaceAll(str, 'mfgDate', '${qrCodes[i'+((Number(x) !== 0) ? x : '')+'].mfd}')
          str = this.replaceAll(str, '012345678901', '${qrCodes[i'+((Number(x) !== 0) ? x : '')+'].qrCode}')
          str = '${qrCodes[i'+((Number(x) !== 0) ? x : '')+'] ? '+ ('`'+str+'`') + " : ''}"
          zpl += str;
        }

        zpl += '\n'+this.selectedFormat[(this.selectedFormat.length - 1)]+'\n \n'
        let qrCodes = this.batchCodes;
        let tpl: string | number;

        for(let i = 0; i < qrCodes.length; i = i+(this.selectedFormat.length-2)) { // check here
          if(!tpl) {
            tpl = eval('`'+zpl+'`')
          }else {
            tpl += eval('`'+zpl+'`')
          }
        }
        this.finalFullCodeZpl = tpl;
        console.log(tpl, " ::::::: generated zpl label ::::::::");

      }
    })
  }

  replaceAll(str: any, find: any, replace: any) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  printSelected() {
    let self = this;
    BrowserPrint.getLocalDevices(function(prntr: any) {
      let printers_available = false;
      console.log(prntr);
      prntr = prntr.printer;
      console.log(prntr)
      if (prntr != undefined) {
        for (let i = 0; i < prntr.length; i++) {
          if (prntr[i].connection == 'usb') {
            printers_available = true;
          }
        }
      }
      console.log(printers_available, "printer Availability!")
      if(!printers_available) {
        self.toaster.warning("No Zebra Printers could be found!")
      }else {
        // printer is available
        BrowserPrint.getDefaultDevice('printer', function(printer: any) {
          console.log(printer);
          printer.read(function(x:any){
            alert(1);
          },function(y: any) {
            alert(2);
          })
          printer.sendThenRead("~HQES",
          function(text: any) {
            console.log(text);
            var is_error = text.charAt(70);
            var media = text.charAt(88);
            var head = text.charAt(87);
            var pause = text.charAt(84);
            console.log(media, "media")
            if (is_error == '0') {
              printer.send(
                self.finalFullCodeZpl,function (p: any) {
                  console.log(p);
                  // alert('Print finsihed')
                  // self.myInterval = setInterval(function() {
                  //   printer.sendThenRead("PRINTER",
                  //   function(txt: any) {
                  //     console.log(txt, "Uma")
                  //   })
                  // },1000)
                  self.toaster.success("print command send finished");
                }, function (q: any) {
                  console.log(q);
                  // alert('Print error')
                }
              )
              printer.sendFinishedCallback(function(txtnew: any) {
                console.log(txtnew);
                self.toaster.success('printing finished')
              })
            }
            printer.sendFinishedCallback(function(e: any) {
              console.log(e, 'success call');
            }) 
            printer.sendErrorCallback(function(e:any) {
              console.log(e, "error call")
            })
            if(is_error == '1') {
              self.toaster.warning('Paper out')
            }
            if(is_error == '2') {
              self.toaster.warning('Ribbon out')
            }
            if(is_error == '4') {
              self.toaster.warning('Media Door Open');
            }
            if(is_error == '8') {
              self.toaster.warning('Cutter Fault');
            }
            if (head == '1'){
              self.toaster.warning("Printhead Overheating");
            }
            if (head == '2') {
              self.toaster.warning("Motor Overheating");
            }
            if (head == '4') {
              self.toaster.warning("Printhead Fault");
            }
            if (head == '8') {
              self.toaster.warning("Incorrect Printhead");
            }
            if (pause == '1') {
              self.toaster.warning("Printer Paused");
            }
          }, function(error: any){
            console.log(error);
            self.toaster.error(error);
            self.toaster.warning("Please verify printer is connected properly or not")
          })
        });
      }
    })
  }

  printComplete() {
    alert('print completed')
  }

  printError() {
    alert('Printer Error')
  }
  
}
