import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";


declare  let BrowserPrint:  any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ZPL';
  tpyeOfCode: any = 'qrCode';
  sizeOfCode: any = '';
  width: any = '4';
  height: any = '1';
  printDensity: any = '8';
  zplCode: any = '';
  blobSrc: any;
  sampleBlobSrc: any;
  sampleDataObject: any = {};
  url = 'http://192.168.3.6:3000/generateLabel';
  ZPLForm: FormGroup;
  previewZpl: any;
  apiEndPoint: any = `http://172.24.2.80:8086/`;
  qrCodes: any = [];
  formatName: any;
  selectedFormat: any;
  allSKU: any = [];
  selectedSKU: any = [];
  dalBrandSKU: any = [];
  levels: any = [];
  versions: any = [];
  dalEncryptions: any = [];

  brandSKU: any;
  level: any;
  version: any;
  dalEncryption: any;

  dynamicForm: FormGroup;


  zplArr: any = [];
  
  constructor(
    private _sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ) {
      // for(let i=0; i < 10; i++) {
      //   this.zplArr.push({
      //     'id': i+1,
      //     'zplCode': Math.random().toString(36).substring(2).toUpperCase()
      //   })
      // }
  }

  ngOnInit() {
    this.ZPLForm = this.fb.group({
      zplCodes: new FormArray([])
    });
    this.dynamicForm = this.fb.group({
      labels: new FormArray([])
    })
    // console.log(BrowserPrint, "PPP");
    // this.getAllQRCodes();
    // this.getAllSKU();


    // this.getDalBrandSKU();
    // this.getLevels();
    // this.getVersions();
    // this.getDalEncryptions();


  }

  // get f() { return this.dynamicForm.controls; }
  // get t() { return this.f.labels as FormArray; }

  get zpl() {
    return this.ZPLForm.controls;
  }

  get codes() {
    return this.zpl.zplCodes as FormArray;
  }

  // AddNewField() {
  //   this.codes.push(this.fb.group({
  //     textWeight: [],
  //     size: [],
  //     x: ['20'],
  //     y:['20'],
  //     type: ['^FD'],
  //     text: [],
  //     length: ['30'],
  //     breadth: ['50']
  //   }));
  // }

  onChangelabels(e : any) {
    console.log(e.value);
    let noOfLabels = Number(e.value) || 0;
    if(this.codes.length < noOfLabels) {
      for(let i = this.codes.length; i < noOfLabels; i++) {
        this.codes.push(this.fb.group({
          textWeight: [],
          size: [],
          x: ['20'],
          y:['20'],
          type: ['^FD'],
          text: [],
          length: ['30'],
          breadth: ['50']
        }))
      }
    }
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

  uploadZPL(e : any) {
    console.log(e);
    let MyFile = e.target.files[0];
    console.log(MyFile);
    this.readFile(MyFile)
  }

  readFile(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
        // console.log(reader.result ,"PPP");
        this.zplCode = reader.result;
    };
    reader.readAsText(file);
  }

  printZPLFormFile() {
    let self = this;
    BrowserPrint.getDefaultDevice('printer', function(printer: any) {
      printer.send(
        self.zplCode
      )
    },function(error_response :any) {
      console.log(error_response);
    });
  }

  printZPL(val: any) {
    if(val) {
      this.toastr.success(`Print starts from value ${val}!`)
    }else {
      this.toastr.success('Sends ZPL Code directly to printer for printing!')
    }
  }
  
  createZPLFile() {
    console.log(this.zplArr, "My Array!");
    // ^FX Second section with recipient address and permit information.
    console.log(this.sizeOfCode, "PPP");
    if(this.sizeOfCode != '') {
      let str = '^XA \n'
      if(this.sizeOfCode == 's') {
        this.zplArr.map((z: any,i: any)=> {
          str += '\n'
          str += `^FX ----Start of ${i+1}---- \n`
          str += `^FO${35}+${z.x ? z.x: ''},25^BQ,2,5^FDHA,${z.zplCode}^FS  \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        })
      }
      if(this.sizeOfCode == 'm') {
        this.zplArr.map((z: any, i: any) => {
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^FO35,25^BQ,2,5^FDHA,${z.zplCode}^FS \n ^CFA,20 \n ^FO35,165^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        })
      }
      if(this.sizeOfCode == 'm1') {
        this.zplArr.map((z: any, i: any) => {
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^FO35,25^BQ,2,5^FDHA,${z.zplCode}^FS \n ^CFA,20 \n ^FO35,15^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        })
      }
  
      if(this.sizeOfCode == 'l') {
        this.zplArr.map((z: any, i: any) => {
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^CF0,30 \n 
                  ^FO0,30^FDMFG: Dhanuka^FS \n 
                  ^FO0,60^FDITEM: 38102^FS \n 
                  ^FO0,90^FDExp: 10/2020^FS \n 
                  ^FO200,0^BQ,2,5^FDHA,${z.zplCode}^FS \n
                  ^CFA,20 \n 
                  ^FO200,150^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        })
      }
  
      if(this.sizeOfCode == 'l1') {
        this.zplArr.map((z: any, i: any) => {
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^CF0,30 \n 
                  ^FO150,30 \n
                  ^FDMFG: Dhanuka^FS \n
                  ^FO150,60^FDITEM: 38102^FS \n
                  ^FO150,90^FDExp: 10/2020^FS \n
                  ^FO0,0^BQ,2,5^FDHA,${z.zplCode}^FS \n
                  ^CFA,20 \n^FO0,150^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        })
      }
      str +='^XZ'
      
      console.log(str);
      
      var fileName = 'Dhanuka zplFile '+new Date().toString();;
      var type = 'zpl';
      var data = str;
      var file = new Blob([data], {
      type: type
      });
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fileName);
      else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName + '.' +type;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 100);
      }
    }else {
      this.toastr.warning('Please select Format!')
    }
    
  }

  printFromSpecificIndex(val: any) {
    console.log(val);
    if(this.sizeOfCode != '' && val) {
      let str = '^XA \n'
      if(this.sizeOfCode == 's') {
        for(let i = Number(val)-1; i < this.zplArr.length; i++) {
          let z = this.zplArr[i];
          str += '\n'
          str += `^FX ----Start of ${i+1}---- \n`
          str += `^FO35,25^BQ,2,5^FDHA,${z.zplCode}^FS  \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        }
      }
      if(this.sizeOfCode == 'm') {
        for(let i = Number(val)-1; i < this.zplArr.length; i++) {
          let z = this.zplArr[i];
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^FO35,25^BQ,2,5^FDHA,${z.zplCode}^FS \n ^CFA,20 \n ^FO35,165^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        }
      }
      if(this.sizeOfCode == 'm1') {
        for(let i = Number(val)-1; i < this.zplArr.length; i++) {
          let z = this.zplArr[i];
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^FO35,25^BQ,2,5^FDHA,${z.zplCode}^FS \n ^CFA,20 \n ^FO35,15^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        }
      }
      if(this.sizeOfCode == 'l') {
        for(let i = Number(val)-1; i < this.zplArr.length; i++) {
          let z = this.zplArr[i];
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^CF0,30 \n 
          ^FO0,30^FDMFG: Dhanuka^FS \n 
          ^FO0,60^FDITEM: 38102^FS \n 
          ^FO0,90^FDExp: 10/2020^FS \n 
          ^FO200,0^BQ,2,5^FDHA,${z.zplCode}^FS \n
          ^CFA,20 \n 
          ^FO200,150^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        }
      }
      if(this.sizeOfCode == 'l1') {
        for(let i = Number(val)-1; i < this.zplArr.length; i++) {
          let z = this.zplArr[i];
          str += '\n'
          str += `^FX ---- Start of ${i+1} --- \n`
          str += `^CF0,30 \n 
          ^FO150,30 \n
          ^FDMFG: Dhanuka^FS \n
          ^FO150,60^FDITEM: 38102^FS \n
          ^FO150,90^FDExp: 10/2020^FS \n
          ^FO0,0^BQ,2,5^FDHA,${z.zplCode}^FS \n
          ^CFA,20 \n^FO0,150^FD${z.zplCode}^FS \n`
          str += `^FX ----End of ${i+1}---- \n`
          str += '\n'
        }
      }
      str +='^XZ'
      console.log(str);
      var fileName = `Dhanuka specific Index ${val} zplFile `+new Date().toString();;
      var type = 'zpl';
      var data = str;
      var file = new Blob([data], {
      type: type
      });
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fileName);
      else { // Others
        var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName + '.' +type;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 100);
      }  
    }else {
      this.toastr.warning('Please enter the number to start or Please select Format')
    } 
  }

  async getAllQRCodes() {
    this.spinner.show();
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
      this.spinner.hide();
    } catch(error) {
      this.toastr.error('Something went wrong!');
      this.spinner.hide();
      console.log(error)
    }
  }

  async saveZPLCode() {
    this.spinner.show();
    try { 
      let response = await fetch(this.apiEndPoint+'dal/qrFormat/create', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({
          formatData: {
            zplCode: this.zplCode,
            formatName: this.formatName
          }
        }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json, "PPP");
      if(json.id) {
        setTimeout(()=> {
          this.spinner.hide();
          this.getAllQRCodes();
        },4000);
        this.zplCode = '';
        this.toastr.success('Created Successfully!');
        this.ZPLForm.reset();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getAllSKU() {
    try {
      let response = await fetch(this.apiEndPoint+'dal/dalBrandAndSku/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = await response.json();
      console.log(json);
      this.allSKU = json.content;
    }catch(error) {
      console.error('Error:', error);
    }
  }

  async saveLinkSKUFormat() {
    console.log(this.selectedFormat);
    console.log('--------------');
    console.log(this.selectedSKU);
    try {
      let response = await fetch(this.apiEndPoint+'dal/dalBrandAndSku/linkFormat', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({
          dalBrandAndSkuIds: this.selectedSKU,
          dalQRFormatId: this.selectedFormat
        }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let json = response;
      console.log(json, "PPP");
        this.zplCode = '';
        this.toastr.success('Prefrences Saved Successfully!');
        this.selectedFormat = '';
        this.selectedSKU = [];
        // this.ZPLForm.reset();
    } catch(error) {
      console.log('Error:',error);
    }
  }

  testPrint() {
    let self = this;
    BrowserPrint.getDefaultDevice('printer', function(printer: any) {
      printer.send(
        self.zplCode
      )
    },function(error_response :any) {
      console.log(error_response);
    });
  }

  drop(event: any,x: any,y: any,index: any) {
    console.log(event,x,y,index)
    console.log('x: '+(event.distance.x+Number(x)),'y: '+(event.distance.y+Number(y)));
    let zplCodes = this.ZPLForm.controls.zplCodes.value;
    zplCodes.map((z: any,i: any)=> {
      if(index == i) {
        z.x = (event.distance.x+Number(x)).toString();
        z.y = (event.distance.y+Number(y)).toString();
      }
    });
    this.ZPLForm.controls.zplCodes.setValue(zplCodes);
    // console.log(this.ZPLForm)
    // let element = event.source.getRootElement();
    // // console.log(element.source.getRootElement())
    // let boundingClientRect = element.getBoundingClientRect();
    // let parentPosition = this.getPosition(element);
    // console.log('x: ' + ((boundingClientRect.x - parentPosition.left)+x), 'y: ' + ((boundingClientRect.y - parentPosition.top)+y)); 
  }

  getPosition(el: any) {
    let x = 0;
    let y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  // get zpl() {
  //   return this.ZPLForm.controls;
  // }

  // get codes() {
  //   return this.zpl.zplCodes as FormArray;
  // }

  // AddNewField() {
  //   this.codes.push(this.fb.group({
  //     textWeight: [],
  //     size: [],
  //     x: ['20'],
  //     y:['20'],
  //     type: ['^FD'],
  //     text: [],
  //     length: ['30'],
  //     breadth: ['50']
  //   }));
  // }

  DeleteField(i: any) {
    console.log(i);
    this.codes.removeAt(i);
  }

  generateZpl(e: any) {
    // console.log(this.ZPLForm.controls['zplCodes'].value);
    let zplArr = this.ZPLForm.controls['zplCodes'].value;
    let str = '^XA'
      zplArr.map((z: any,i: any)=> {
        if(z.type == '^FD') { // text
          str += z.textWeight+','+z.size
          str += '^FO'+z.x+','+z.y+z.type
          str += '^FD'+z.text+'^FS'
        }
        if(z.type == '^BQ,2') { //QR Code 
          str += '^FO'+z.x+','+z.y+z.type+','+z.textWeight
          str += '^FD'+z.size+'A,'+z.text+'^FS'
        }
        if(z.type == '^GB') {
          str += '^FO'+z.x+','+z.y+z.type+z.length+','+z.breadth+','+z.textWeight+'^FS'
        }
        if(z.type == '^BXN') {
          str += '^FO'+z.x+','+z.y+z.type+','+z.textWeight+','+z.size+'^FD'+z.text+'^FS'
        }
      });
      str +='^XZ'
    console.log(str);
    this.zplCode = str;
  }

  formatChange(e: any) {
    console.log(e);
    if(e == 's') {
      this.callSampleApi({
        zpl: `^XA^FO35,25^BQ,2,5^FDHA,123456Text^FS^XZ`,
        width: 1,
        height: 1,
        density: 8
      });
    }else if(e == 'm') {
      this.callSampleApi({
        zpl: `^XA^FO35,25^BQ,2,5^FDHA,123456Text^FS^CFA,20^FO35,165^FD123456Text^FS^XZ`,
        width: 1,
        height: 1,
        density: 8
      })
    }else if(e == 'm1') {
      this.callSampleApi({
        zpl: `^XA^FO35,25^BQ,2,5^FDHA,123456Text^FS^CFA,20^FO35,15^FD123456Text^FS^XZ`,
        width: 1,
        height: 1,
        density: 8
      })
    }else if(e == 'l') {
      this.callSampleApi({
        zpl: `^XA^CF0,30^FO0,30^FDMFG: Dhanuka^FS^FO0,60^FDITEM: 38102^FS^FO0,90^FDExp: 10/2020^FS^FO200,0^BQ,2,5^FDHA,123456Text^FS^CFA,20^FO200,150^FD123456Text^FS^XZ`,
        width: 1.7,
        height: .9,
        density: 8
      })
    }else if(e == 'l1') {
      this.callSampleApi({
        zpl: `^XA^CF0,30^FO150,30^FDMFG: Dhanuka^FS^FO150,60^FDITEM: 38102^FS^FO150,90^FDExp: 10/2020^FS^FO0,0^BQ,2,5^FDHA,123456Text^FS^CFA,20^FO0,150^FD123456Text^FS^XZ`,
        width: 2,
        height: .9,
        density: 8
      })
    }
  }

  async callSampleApi(data: any) {
    
    // data.density = this.printDensity;
    this.sampleDataObject = data;
    console.log(data);
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
      this.sampleBlobSrc = this._sanitizer.bypassSecurityTrustUrl('data:application/octet-stream;base64,'+ base64);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async  callApi() {
    // alert(1);
    let data = { 
      zpl: this.zplCode,
      width: this.width,
      height: this.height,
      density: this.printDensity 
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
}
