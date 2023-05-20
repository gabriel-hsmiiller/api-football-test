import { IGoal } from './goal';
import { ILineup } from './lineup';

export interface ITeam {
    id: number;
    name: string;
    logo: string;
    leagueId: number;
    seasons: Array<number>;
    lineups: Array<ILineup>;
    goals: IGoal;
    statistics: ITeamStatistics;
}

export interface ITeamStatistics {
    games: number;
    wins: number;
    losses: number;
    draws: number;
}
