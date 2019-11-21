import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

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
  blobSrc: any;
  width: any = '4';
  height: any = '1';
  printDensity: any = '8';

  constructor(
      private fb: FormBuilder,
      private _sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.labelsForm = this.fb.group({
      labels: new FormArray([])
    })
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
