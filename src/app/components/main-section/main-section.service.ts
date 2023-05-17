import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICountry } from 'src/app/models/country';
import { ILeague } from 'src/app/models/league';
import { ITeam } from 'src/app/models/team';

@Injectable({
  providedIn: 'root'
})
export class MainSectionService {
  
  public countries$: BehaviorSubject<Array<ICountry>> = new BehaviorSubject<Array<ICountry>>([]);
  public leagues$: BehaviorSubject<Array<ILeague>> = new BehaviorSubject<Array<ILeague>>([]);
  public teams$: BehaviorSubject<Array<ITeam>> = new BehaviorSubject<Array<ITeam>>([]);
  public seasons$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);

  public selectedCountry: string | null = null;
  public selectedLeague: number | null = null;
  public selectedTeam: number | null = null;
  public selectedSeason: number | null = null;

  constructor() { }

  getAllCountries() {
    this.countries$.next([]);
  }

  getAllLeaguesFromCountry() {
    this.leagues$.next([]);
  }

  getAllTeamsFromLeague() {
    this.teams$.next([]);
  }

  getAllSeasonsFromTeam() {
    this.seasons$.next([]);
  }

  getAllSeasonsFromLeague() {
    this.seasons$.next([]);
  }

}
