import * as env from "env-var";
import { Db, MongoClient } from "mongodb";

import { Entry } from "../types";
import { IDatabase } from "./interfaces";

// Singleton class
export default class MongoDatabase implements IDatabase {
	static readonly dbName = "iberica";

	static readonly moviesCollection = "movies";
	static readonly seriesCollection = "series";

	private static client?: MongoClient;

	private static get mongoUri() {
		return env.get("MONGO_URI").required().asString();
	}

	static async getClient(): Promise<MongoClient> {
		if (!MongoDatabase.client) {
			MongoDatabase.client = new MongoClient(MongoDatabase.mongoUri);
			await MongoDatabase.client.connect();
		}

		return MongoDatabase.client;
	}

	static async getDb(): Promise<Db> {
		return (await MongoDatabase.getClient()).db(MongoDatabase.dbName);
	}

	async getMovie(ttId: string): Promise<Entry[]> {
		const collection = (await MongoDatabase.getDb()).collection<Entry>(
			MongoDatabase.moviesCollection
		);

		return await collection.find({ ttId }).toArray();
	}

	async getSerie(ttId: string, season: number, episode: number): Promise<Entry[]> {
		const collection = (await MongoDatabase.getDb()).collection<Entry>(
			MongoDatabase.seriesCollection
		);

		return await collection.find({ ttId, season, episode }).toArray();
	}

	async setMovies(entries: Omit<Entry, "season" | "episode">[]): Promise<void> {
		const collection = (await MongoDatabase.getDb()).collection(MongoDatabase.moviesCollection);
		await collection.insertMany(entries);
	}

	async setSeries(_entries: Required<Entry>[]): Promise<void> {
		const collection = (await MongoDatabase.getDb()).collection(MongoDatabase.seriesCollection);
		await collection.insertMany(_entries);
	}
}
