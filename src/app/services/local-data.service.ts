import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';

import { Storage } from '@ionic/storage-angular';
import { NavController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';


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
                this.onOpenBrowser(register.text)
        }
    }

    onOpenBrowser(url){

        if(this.platform.is('ios') || this.platform.is('android')){
            const browser = this.appBrowser.create(url);
            browser.show();
            return
        }

        window.open( url, '_blank')

    }

    onOpenMap(url){
        // if (this.platform.is('ios')) {
        //     window.open('maps://?q=' + offer.position.lat + ',' + offer.position.lng, '_system');
        //   }
        // if (this.platform.is('android')) {
        //     window.open('geo://' + offer.position.lat + ',' + offer.position.lng + '?q=' + offer.position.lat + ',' + offer.position.lng + '(' + offer.ag_name + ')', '_system');
        //   }
    }
}
