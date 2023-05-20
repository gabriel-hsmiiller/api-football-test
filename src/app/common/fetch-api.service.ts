import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, timeout, filter, tap } from 'rxjs';
import { ICountry } from '../models/country';
import { ILeague } from '../models/league';
import { ITeam } from '../models/team';
import { IPlayer } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class FetchApiService {
  
  private _headers: HttpHeaders = new HttpHeaders()
    .set('x-rapidapi-key', '')
    .set('x-rapidapi-host', 'v3.football.api-sports.io');

  constructor(private http: HttpClient) { }

  fetchCountries() {
    return this.http.get('https://v3.football.api-sports.io/countries', { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => (data.response as Array<ICountry> || [])),
    );
  }
  
  fetchLeaguesFromCountry(countryCode: string) {
    return this.http.get(`https://v3.football.api-sports.io/leagues?code=${countryCode}`, { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => {
        const parsedLeagues: Array<ILeague> = data.response?.map((item: any) => ({
          id: item.league.id,
          name: item.league.name,
          logo: item.league.logo,
          countryCode: item.country.code
        }));
        
        return parsedLeagues || [];
      }),
    );
  }

  fetchTeamsFromLeague(leagueId: number, season: number) {
    return this.http.get(`https://v3.football.api-sports.io/teams?league=${leagueId}&season=${season}`, { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => {
        const parsedTeams: Array<ITeam> = data.response?.map((item: any) => {
          return {
            id: item.team.id,
            name: item.team.name,
            logo: item.team.logo,
            leagueId,
            season,
          } as ITeam;
        });

        return parsedTeams || [];
      }),
    );
  }

  fetchDetailsFromTeam(teamId: number, leagueId: number, season: number) {
    return this.http.get(`https://v3.football.api-sports.io/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`, { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => {
        const statistics = {
          games: data.response.fixtures.played.total,
          wins: data.response.fixtures.wins.total,
          draws: data.response.fixtures.draws.total,
          losses: data.response.fixtures.loses.total,
        };

        const parsedTeam: ITeam = {
          id: data.response.team.id,
          name: data.response.team.name,
          logo: data.response.team.logo,
          leagueId: data.response.league.id,
          lineups: data.response.lineups,
          goals: data.response.goals.for.minute,
          season: season,
          statistics
        };

        return parsedTeam || [];
      }),
    );
  }
  
  fetchSeasonsFromLeague() {
    return this.http.get(`https://v3.football.api-sports.io/leagues/seasons`, { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => (data.response as Array<number> || [])),
    );
  }

  fetchPlayersFromTeam(teamId: number, season: number) {
    return this.http.get(`https://v3.football.api-sports.io/players?team=${teamId}&season=${season}`, { headers: this._headers }).pipe(
      filter((response: any) => (response.errors && response.errors.length <= 0) || !response.message),
      timeout(10_000),
      catchError((err, caught) => caught),
      map((data: any) => {
        const parsedPlayers: Array<IPlayer> = data.response?.map((item: any) => ({
          id: item.player.id,
          name: item.player.name,
          age: item.player.age,
          nationality: item.player.nationality,
          photo: item.player.photo,
          position: this._getPlayerPosition(item, teamId, season),
          teamId,
          season,
        }));

        return parsedPlayers || [];
      }),
    );
  }
  
  private _getPlayerPosition(playerData: any, teamId: number, season: number) {
    return playerData.statistics.find((s: any) => s.team.id === teamId && s.league.season === season)?.games.position;
  }

}
