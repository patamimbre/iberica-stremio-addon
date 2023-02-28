import { flat } from "radash";

import { IDatabase } from "./db/interfaces";
import MongoDatabase from "./db/mongo";
import { convertMovieToEntry, convertSerieToEntries } from "./services/conversion";
import searchOnMejortorrent from "./services/mejortorrent";
import ttIdToTitles from "./services/tmdb";
import { Entry } from "./types";

export default class Server {
	private static readonly db: IDatabase = new MongoDatabase();
	private static readonly searchFunction = searchOnMejortorrent;
	private static readonly idToTitlesFunction = ttIdToTitles;

	public static async getMovie(ttId: string): Promise<Entry[]> {
		const movieFromDb = await this.db.getMovie(ttId);
		if (movieFromDb.length > 0) {
			return movieFromDb;
		}

		const titles = await this.idToTitlesFunction(ttId);
		const { movies } = await this.searchFunction(titles);

		const movieEntries = movies.map((e) => convertMovieToEntry(ttId, e));
		await this.db.setMovies(movieEntries);

		return movieEntries;
	}

	public static async getSerie(ttId: string, season: number, episode: number): Promise<Entry[]> {
		const serieFromDb = await this.db.getSerie(ttId, season, episode);

		if (serieFromDb.length > 0) {
			return serieFromDb;
		}

		const titles = await this.idToTitlesFunction(ttId);
		const { series } = await this.searchFunction(titles);

		const serieEntries = flat(series.map((e) => convertSerieToEntries(ttId, e)));
		await this.db.setSeries(serieEntries);

		return serieEntries.filter((e) => e.season === season && e.episode === episode);
	}
}
