import { Entry } from "../types";

export interface IDatabase {
	// List of entries because there can be multiple entries for the same ttId (quality)
	getMovie(ttId: string): Promise<Entry[]>;
	getSerie(ttId: string, season: number, episode?: number): Promise<Entry[]>;

	setMovies(entries: Omit<Entry, "season" | "episode">[]): Promise<void>;
	setSeries(entries: Entry[]): Promise<void>;
}
