import { IGoal } from "./goal";
import { ILineup } from "./lineup";
import { IPlayer } from "./player";

export interface ITeam {
    id: number;
    name: string;
    code: string;
    logo: string;
    seasons: Array<number>;
    lineups: Array<ILineup>;
    players: Array<IPlayer>;
    goals: Array<IGoal>;
}
