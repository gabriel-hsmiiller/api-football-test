import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ICountry } from 'src/app/models/country';
import { ILeague } from 'src/app/models/league';
import { ITeam, ITeamDetails } from 'src/app/models/team';
import { IPlayer } from 'src/app/models/player';
import { FetchApiService } from 'src/app/common/fetch-api.service';
import { IndexedDbService } from 'src/app/common/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class MainSectionService {
  
  public countries$: BehaviorSubject<Array<ICountry>> = new BehaviorSubject<Array<ICountry>>([]);
  public leagues$: BehaviorSubject<Array<ILeague>> = new BehaviorSubject<Array<ILeague>>([]);
  public teams$: BehaviorSubject<Array<ITeam>> = new BehaviorSubject<Array<ITeam>>([]);
  public seasons$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);
  public players$: BehaviorSubject<Array<IPlayer>> = new BehaviorSubject<Array<IPlayer>>([]);
  public selectedTeamInformation$: BehaviorSubject<ITeam | null> = new BehaviorSubject<ITeam | null>(null);

  public selectedCountry: string | null = null;
  public selectedLeague: number | null = null;
  public selectedTeam: number | null = null;
  public selectedSeason: number | null = null;

  constructor(private fetchApi: FetchApiService, private db: IndexedDbService) { }

  async getAllCountries() {
    let countries: Array<ICountry> = [];

    countries = await this.db.getCountries();

    if (!countries || countries.length <= 0) {
      countries = await firstValueFrom(this.fetchApi.fetchCountries());
      await this.db.addCountries(countries);
    }

    this.countries$.next(countries);
  }

  async getAllLeaguesFromCountry() {
    let leagues: Array<ILeague> = [];

    leagues = await this.db.getLeaguesFromCountry(this.selectedCountry!);

    if (!leagues || leagues.length <= 0) {
      leagues = await firstValueFrom(this.fetchApi.fetchLeaguesFromCountry(this.selectedCountry!));
      await this.db.addLeagues(leagues);
    }

    this.leagues$.next(leagues);
  }

  async getAllTeamsFromLeague() {
    let teams: Array<ITeam> = [];
    
    teams = await this.db.getTeamsFromLeague(this.selectedLeague!, this.selectedSeason!);

    if (!teams || teams.length <= 0) {
      teams = await firstValueFrom(this.fetchApi.fetchTeamsFromLeague(this.selectedLeague!, this.selectedSeason!));
      await this.db.addTeams(teams);
    }

    this.teams$.next(teams);
  }

  async getDetailsFromTeam() {
    let team: ITeam | null = null;

    team = await this.db.getTeamInfo(this.selectedTeam!, this.selectedSeason!) || null;

    const _idb = team?._idb;

    if (team && (!team.lineups || !team.goals || !team.season || !team.statistics)) {
      team = await firstValueFrom(this.fetchApi.fetchDetailsFromTeam(this.selectedTeam!, this.selectedLeague!, this.selectedSeason!));
      const details: ITeamDetails = { season: team.season, lineups: team.lineups, goals: team.goals, statistics: team.statistics };
      await this.db.addDetailsToTeam(_idb!, details);
    }

    this.selectedTeamInformation$.next(team);
  }

  async getAllSeasonsFromLeague() {
    let seasons: Array<number> = [];
    
    seasons = await this.db.getSeasonsFromLeague(this.selectedLeague!) || [];

    if (!seasons || seasons.length <= 0) {
      seasons = await firstValueFrom(this.fetchApi.fetchSeasonsFromLeague());
      await this.db.addSeasonsToLeague(this.selectedLeague!, seasons);
    }

    this.seasons$.next(seasons);
  }

  async getAllPlayersFromTeam() {
    let players: Array<IPlayer> = [];

    players = await this.db.getPlayersFromTeam(this.selectedTeam!, this.selectedSeason!) || [];

    if (!players || players.length <= 0) {
      players = await firstValueFrom(this.fetchApi.fetchPlayersFromTeam(this.selectedTeam!, this.selectedSeason!));
      await this.db.addPlayers(players);
    }

    this.players$.next(players);
  }

}
