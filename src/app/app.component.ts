import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

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
  zplCode: any = `
  ^XA
  ^CF0,30
  ^FO20,60^FDMFG: Dhanuka^FS
  ^FO20,100^FDITEM: 38102^FS
  ^FO20,140^FDExp: 10/2020^FS
  ^FO220,30^BQ,2,5
  ^FDHA,123456Text^FS
  ^CFA,20
  ^FO220,180^FD123456Text^FS
  ^XZ
    
  `;
  blobSrc: any;
  sampleBlobSrc: any;
  sampleDataObject: any = {};
  url = 'http://192.168.3.6:3000/generateLabel';
  ZPLForm: FormGroup;
  previewZpl: any;
  
  constructor(
    private _sanitizer: DomSanitizer,
    private fb: FormBuilder
    ) {

  }

  ngOnInit() {
    this.ZPLForm = this.fb.group({
      zplCodes: new FormArray([])
    })
  }

  drop(event: any,x: any,y: any,index: any) {
    console.log(event,x,y,index)
    console.log('x: '+(event.distance.x+Number(x)),'y: '+(event.distance.y+Number(y)));
    let zplCodes = this.ZPLForm.controls.zplCodes.value;
    zplCodes.map((z: any,i: any)=> {
      // console.log(this.ZPLForm.controls.zplCodes.value[i])
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

  get zpl() {
    return this.ZPLForm.controls;
  }

  get codes() {
    return this.zpl.zplCodes as FormArray;
  }

  AddNewField() {
    this.codes.push(this.fb.group({
      textWeight: [],
      size: [],
      x: ['20'],
      y:['20'],
      type: ['^FD'],
      text: [],
      length: ['30'],
      breadth: ['50']
    }));
  }

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
