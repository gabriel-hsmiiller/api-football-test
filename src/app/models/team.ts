import { IGoal } from './goal';
import { ILineup } from './lineup';

export interface ITeam extends ITeamDetails {
    _idb?: number;
    id: number;
    name: string;
    logo: string;
    leagueId: number;
}

export interface ITeamStatistics {
    games: number;
    wins: number;
    losses: number;
    draws: number;
}

export interface ITeamDetails {
    season: number;
    lineups: Array<ILineup>;
    goals: IGoal;
    statistics: ITeamStatistics;
}
