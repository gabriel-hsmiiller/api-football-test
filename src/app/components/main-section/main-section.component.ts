import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { MainSectionService } from './main-section.service';
import { ILineup } from 'src/app/models/lineup';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.scss']
})
export class MainSectionComponent implements OnInit {

  public lineupPositions: Array<Array<number>> = [];

  public pieChartOptions: ChartOptions<'pie'> = { responsive: true }
  public pieChartLabels = ['0\'-15\'' , '16\'-30\'', '31\'-45\'', '46\'-60\'', '61\'-75\'', '76\'-90\'', '91\'-105\'', '106\'-120\''];
  public pieChartDatasets = [ { data: [] as any[], backgroundColor: ['#83ab80', '#51894d', '#2c7026', '#075700', '#064f00', '#054600', '#043c00', '#022c00'] } ];
  public pieChartLegend = true;

  constructor(public mainSectionService: MainSectionService) {}

  async ngOnInit() {
    await this.mainSectionService.getAllCountries();
  }

  async onSelectCountry() {
    await this.mainSectionService.getAllLeaguesFromCountry();
  }

  async onSelectLeague() {
    await this.mainSectionService.getAllSeasonsFromLeague();
  }

  async onSelectSeason() {
    await this.mainSectionService.getAllTeamsFromLeague();
  }

  async onSelectTeam() {
    await this.mainSectionService.getDetailsFromTeam();
    await this.mainSectionService.getAllPlayersFromTeam();

    this.getGoalsForChart();
  }

  getLineupPositions(lineup: ILineup) {
    const positions = lineup.formation.split('-');
    this.lineupPositions = positions.map((position) => {
      const line = [];

      for (let i = 0; i < +position; i++) {
        line.push(i);
      }

      return line;
    });
  }

  getGoalsForChart() {
    const teamDetails = this.mainSectionService.selectedTeamInformation$.value;

    Object.values(teamDetails!.goals).forEach((value) => {
      const number = +value.percentage?.replace('%', '');
      this.pieChartDatasets[0].data.push(number);
    });
  }

}
