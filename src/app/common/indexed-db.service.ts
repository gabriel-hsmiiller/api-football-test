import { Injectable } from '@angular/core'
import Dexie, { Table } from 'dexie';
import { ICountry } from '../models/country';
import { ILeague } from '../models/league';
import { ITeam, ITeamDetails } from '../models/team';
import { IPlayer } from '../models/player';

@Injectable({ providedIn: 'root' })
export class IndexedDbService extends Dexie {

  countries!: Table<ICountry, string>;
  leagues!: Table<ILeague, number>;
  teams!: Table<ITeam, number>;
  players!: Table<IPlayer, null>;

  constructor() {
    super('meuTimeDB');
    this.version(6).stores({
      countries: 'code',
      leagues: 'id, countryCode',
      teams: '_idb++, id, [leagueId+season], [id+season]',
      players: '_idb++, id, [teamId+season]'
    })
  }

  async addCountries(countries: Array<ICountry>) {
    await this.countries.bulkAdd(countries);
  }

  async getCountries() {
    return await this.countries.toArray();
  }
  
  async addLeagues(leagues: Array<ILeague>) {
    await this.leagues.bulkAdd(leagues);
  }

  async getLeaguesFromCountry(countryCode: string) {
    return await this.leagues.where({ countryCode }).toArray();
  }
  
  async addTeams(teams: Array<ITeam>) {
    await this.teams.bulkAdd(teams);
  }

  async getTeamsFromLeague(leagueId: number, season: number) {
    return await this.teams.where({ leagueId, season }).toArray();
  }

  async getTeamInfo(teamId: number, season: number) {
    return await this.teams.where({ id: teamId, season }).first();
  }

  async getSeasonsFromLeague(leagueId: number) {
    return (await this.leagues.where({ id: leagueId }).first())?.seasons;
  }

  async addPlayers(players: Array<IPlayer>) {
    await this.players.bulkAdd(players);
  }

  async getPlayersFromTeam(teamId: number, season: number) {
    return await this.players.where({ teamId, season }).toArray();
  }

  async addSeasonsToLeague(leagueId: number, seasons: Array<number>) {
    const leagueSeasons = (await this.leagues.where({ id: leagueId }).first())?.seasons || [];
    await this.leagues.update(leagueId, { seasons: [...leagueSeasons, ...seasons] });
  }

  async addDetailsToTeam(teamIdb: number, details: ITeamDetails) {
    const updated = await this.teams.update(teamIdb, { ...details });
    return updated;
  }
}