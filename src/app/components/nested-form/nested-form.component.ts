import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

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
  apiEndPoint: any = `http://172.24.2.80:8086/`;
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

  constructor(
      private fb: FormBuilder,
      private _sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.labelsForm = this.fb.group({
      labels: new FormArray([])
    });
    this.getDalBrandSKU();
    this.getLevels();
    this.getVersions();
    this.getDalEncryptions();
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
        // setTimeout(()=> {
        // },4000);
        this.zplCode = '';
      }
    } catch (error) {
      console.error('Error:', error);
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
    str +='^XZ'
      
    console.log(str, "::::::Uma:::::::");
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

}
