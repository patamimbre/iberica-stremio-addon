import { Entry } from "../types";
import { IDatabase } from "./interfaces";

export default class MockDatabase implements IDatabase {
	async getMovie(_ttId: string): Promise<Entry[]> {
		return Promise.resolve([
			{
				torrentUrl:
					"https://server-local-storage556-mad51.ultracdn.org/torrents/series/rick-y-morty-1-3.torrent",
				ttId: "tt123456",
				title: "Rick and Morty",
				quality: "720p",
			},
		]);
	}

	async getSerie(_ttId: string, season: number, episode: number): Promise<Entry[]> {
		return Promise.resolve([
			{
				torrentUrl:
					"https://server-local-storage556-mad51.ultracdn.org/torrents/series/rick-y-morty-1-3.torrent",
				ttId: "tt123456",
				title: "Rick and Morty",
				quality: "720p",
				season,
				episode,
			},
		]);
	}

	async setMovies(): Promise<void> {
		return Promise.resolve();
	}

	async setSeries(): Promise<void> {
		return Promise.resolve();
	}
}
