import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;

  constructor() {}

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    let xlfData = `<?xml version="1.0" encoding="UTF-8" ?>
    <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:docment:1.2">
        <file source-language="en" datatype="plaintext" original="ng2.template">
        <body>`;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      if (jsonData.Sheet1) {
        jsonData.Sheet1.forEach((ele: any) => {
          //console.log('ele', ele);
          let item = ` <trans-unit id="1" datatype="html">
          <source>${ele.CurrentConversion}</source>
          <target>${ele.Conversion}</target>
          </trans-unit>`;
          xlfData += item;
        });
      }
      xlfData += `</body>
      </file>
  </xliff>`;

      console.log(xlfData);
      const dataString = JSON.stringify(jsonData);
      document.getElementById('output').innerHTML = dataString
        .slice(0, 300)
        .concat('...');
      this.setDownload(xlfData);
    };
    reader.readAsBinaryString(file);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector('#download');
      el.setAttribute(
        'href',
        `data:text/xml;charset=utf-8,${encodeURIComponent(data)}`
      );
      el.setAttribute('download', 'messages.ar.xlf');
    }, 1000);
  }
}
