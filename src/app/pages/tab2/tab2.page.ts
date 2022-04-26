import { Component } from '@angular/core';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public localData: LocalDataService) {}

}
