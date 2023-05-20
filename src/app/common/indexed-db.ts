import Dexie, { Table } from 'dexie';
import { ICountry } from '../models/country';
import { ILeague } from '../models/league';
import { ITeam } from '../models/team';
import { IPlayer } from '../models/player';

export class IndexedDb extends Dexie {

  countries!: Table<ICountry, string>;
  leagues!: Table<ILeague, number>;
  teams!: Table<ITeam, number>;
  players!: Table<IPlayer, null>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      countries: 'code',
      leagues: 'id, countryCode',
      teams: 'id, leagueId',
      players: 'id, teamId'
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

  async getTeamsFromLeague(leagueId: number) {
    return await this.teams.where({ leagueId }).toArray();
  }

  async getSeasonsFromTeam(teamId: number) {
    return (await this.teams.where({ id: teamId }).first())?.seasons;
  }

  async addPlayers(players: Array<IPlayer>) {
    await this.players.bulkAdd(players);
  }

  async getPlayersFromTeam(teamId: number) {
    return await this.players.where({ teamId }).toArray();
  }

  async addSeasonsToTeam(teamId: number, seasons: Array<number>) {
    await this.teams.update(teamId, { seasons });
  }
}

export const db = new IndexedDb();