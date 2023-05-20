import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, firstValueFrom, map, catchError } from 'rxjs';
import { ICountry } from 'src/app/models/country';
import { ILeague } from 'src/app/models/league';
import { ITeam } from 'src/app/models/team';
import { db } from 'src/app/common/indexed-db';
import { IPlayer } from 'src/app/models/player';

@Injectable({
  providedIn: 'root'
})
export class MainSectionService {
  
  public countries$: BehaviorSubject<Array<ICountry>> = new BehaviorSubject<Array<ICountry>>([]);
  public leagues$: BehaviorSubject<Array<ILeague>> = new BehaviorSubject<Array<ILeague>>([]);
  public teams$: BehaviorSubject<Array<ITeam>> = new BehaviorSubject<Array<ITeam>>([]);
  public seasons$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);
  public players$: BehaviorSubject<Array<IPlayer>> = new BehaviorSubject<Array<IPlayer>>([]);

  public selectedCountry: string | null = null;
  public selectedLeague: number | null = null;
  public selectedTeam: number | null = null;
  public selectedSeason: number | null = null;

  constructor(private http: HttpClient) { }

  async getAllCountries() {
    let countries = [];

    countries = await db.getCountries();

    if (!countries || countries.length <= 0) {
      countries = await this.fetchCountries();
      db.addCountries(countries);
    }

    this.countries$.next(countries);
  }

  async getAllLeaguesFromCountry() {
    let leagues = [];

    leagues = await db.getLeaguesFromCountry(this.selectedCountry!);

    if (!leagues || leagues.length <= 0) {
      leagues = await this.fetchLeaguesFromCountry();
      db.addLeagues(leagues);
    }

    this.leagues$.next(leagues);
  }

  async getAllTeamsFromLeague() {
    let teams = [];
    
    teams = await db.getTeamsFromLeague(this.selectedLeague!);

    if (!teams || teams.length <= 0) {
      teams = await this.fetchTeamsFromLeague();
      db.addTeams(teams);
    }

    this.teams$.next(teams);
  }

  async getAllSeasonsFromTeam() {
    let seasons = [];
    
    seasons = await db.getSeasonsFromTeam(this.selectedSeason!) || [];

    if (!seasons || seasons.length <= 0) {
      seasons = await this.fetchSeasonsFromTeam();
      db.addSeasonsToTeam(this.selectedTeam!, seasons);
    }

    this.seasons$.next(seasons);
  }

  async getAllPlayersFromTeam() {
    let players = [];

    players = await db.getPlayersFromTeam(this.selectedTeam!) || [];

    if (!players || players.length <= 0) {
      players = await this.fetchPlayersFromTeam();
      db.addPlayers(players);
    }

    this.players$.next(players);
  }

  async fetchCountries() {
    const countries: Array<ICountry> = await firstValueFrom(this.http.get('').pipe(
      map((data: any) => data.response),
      catchError((err, caught) => caught)
    ));

    return countries;
  }
  
  async fetchLeaguesFromCountry() {
    const leagues: Array<ILeague> = await firstValueFrom(this.http.get('').pipe(
      map((data: any) => {
        const parsedLeagues = data.response.map((item: any) => ({
          id: item.league.id,
          name: item.league.name,
          logo: item.league.logo,
          countryCode: item.country.code
        }));
        
        return parsedLeagues;
      }),
      catchError((err, caught) => caught)
    ));

    return leagues;
  }

  async fetchTeamsFromLeague() {
    const teams: Array<ITeam> = await firstValueFrom(this.http.get('').pipe(
      map((data: any) => {
        const parsedTeams = data.response.map((item: any) => {
          const statistics = {
            games: item.fixtures.played.total,
            wins: item.fixtures.wins.total,
            draws: item.fixtures.draws.total,
            losses: item.fixtures.losses.total,
          };

          return {
            id: item.team.id,
            name: item.team.name,
            logo: item.team.logo,
            leagueId: item.league.id,
            lineups: item.lineups,
            goals: item.goals.for.minute,
            statistics
          }
        });

        return parsedTeams;
      }),
      catchError((err, caught) => caught)
    ));

    return teams;
  }
  
  async fetchSeasonsFromTeam() {
    const seasons: Array<number> = await firstValueFrom(this.http.get('').pipe(map((data: any) => data.response)));

    return seasons;
  }

  async fetchPlayersFromTeam() {
    const players: Array<IPlayer> = await firstValueFrom(this.http.get('').pipe(
      map((data: any) => {
        const parsedPlayers = data.response.map((item: any) => ({
          id: item.player.id,
          name: item.player.name,
          age: item.player.age,
          nationality: item.player.nationality,
          teamId: this.selectedTeam
        }));
        return parsedPlayers;
      }),
      catchError((err, caught) => caught)
    ));

    return players;
  }

}
