import { Component, OnInit } from '@angular/core';
import { MainSectionService } from './main-section.service';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.scss']
})
export class MainSectionComponent implements OnInit {

  constructor(public mainSectionService: MainSectionService) {

  }
  ngOnInit() {
    this.mainSectionService.getAllCountries();
  }

  onSelectCountry() {
    this.mainSectionService.getAllLeaguesFromCountry();
  }

  onSelectLeague() {
    this.mainSectionService.getAllTeamsFromLeague();
    this.mainSectionService.getAllSeasonsFromLeague();
  }

  onSelectTeam() {
    this.mainSectionService.getAllSeasonsFromTeam();
  }

}
