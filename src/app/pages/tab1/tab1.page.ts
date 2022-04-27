import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    constructor(private barcodeScanner: BarcodeScanner, private localData: LocalDataService) { }

    scan(){
        this.barcodeScanner.scan().then(barcodeData => {
            console.log('Barcode data', barcodeData);
            if(!barcodeData.cancelled){
                this.localData.saveRegiser(barcodeData.format, barcodeData.text);
            }
           }).catch(err => {
               console.log('Error', err);
               this.localData.saveRegiser('QRcode', 'geo:40.90715470124741,-74.621175675?q=40.90715470124741,-74.621175675');

           });
    }
}
