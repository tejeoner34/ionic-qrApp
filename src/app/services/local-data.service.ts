import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';

import { Storage } from '@ionic/storage-angular';
import { NavController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';


@Injectable({
    providedIn: 'root'
})
export class LocalDataService {

    savedRegisters = [];
    _storage: Storage | null = null;

    constructor(
        private storage: Storage, 
        private navController: NavController,
        private appBrowser: InAppBrowser,
        private launchNavigator: LaunchNavigator,
        private geolocation: Geolocation,
        private platform: Platform
        ) { 
        this.init()
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = await this.storage.create();
        this._storage = storage;
        this.loadData();

    }

    async loadData(){
        try{
            const articles = await this._storage.get('registers');
            this.savedRegisters = articles || [];
        }catch(err){

        }
    }

    async saveRegiser(format: string, text: string) {

        await this.loadData(); // nos aseguramos de que no se intente añadir contenido
         //al storage antes de que se hayan cargado los datos que ya están en el storge

        const newRegister = new Register(format, text);
        this.savedRegisters = [newRegister, ...this.savedRegisters];
        this._storage.set('registers', this.savedRegisters);
        this.executeAction(newRegister)
    }

    executeAction(register){
        this.navController.navigateForward('/tabs/tab2');

        switch (register.type){
            case 'http':
                this.onOpenBrowser(register.text);
                break;
            case 'geo':
                this.onOpenMap(register.text);
                break;
            default:
                return 'Error'
        }
    }

    onOpenBrowser(url){

        console.log(this.platform.platforms())
        if(this.platform.is('ios') || this.platform.is('android')){
            const browser = this.appBrowser.create(url);
            browser.show();
            return
        }

        window.open( url, '_blank')

    }

    onOpenMap(url){

        console.log(this.platform.platforms())

        let geo = url;

        geo = geo.slice(4).split('?')[0].split(',');

        let currentLat = '';
        let currentLon = '';
        let destinationLan = geo[0];
        let destinationLon = geo[1];

        

        if(this.platform.is('capacitor') || this.platform.is('cordova')){
            window.open(`geo:${destinationLan},${destinationLon}?q=${destinationLan},${destinationLon}`, '_system')
        }else{
            this.geolocation.getCurrentPosition().then((resp) => {
                currentLat = resp.coords.latitude.toString();
                currentLon = resp.coords.longitude.toString();
                window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&origin=${currentLat},${currentLon}&destination=${destinationLan},${destinationLon}`)
            }).catch((error) => {
                 console.log('Error getting location', error);
               })
        }


        
    }
}
