import axios from "axios";
import * as cheerio from "cheerio";
import { flat, fork, trim } from "radash";

type SearchEntry = {
	title: string;
	type: string;
	quality: string;
	detailsUrl: string;
};

export type MovieEntry = SearchEntry & {
	torrentUrl?: string;
};

export type SerieEntry = SearchEntry & {
	episodes: {
		episode: string;
		torrentUrl?: string;
	}[];
};

export const MOVIE_TYPE = "peliculas";
export const SERIES_TYPE = "series";

const BASE_URL = "https://mejortorrent.wtf/";

async function searchByTitle(title: string): Promise<SearchEntry[]> {
	const url = `${BASE_URL}busqueda?q=${title}`;
	const response = await axios.get(url);
	const $ = cheerio.load(response.data as string);

	return $("div.w-full div.flex.flex-row.mb-2")
		.map((_i, el) => {
			const $el = $(el);
			const title = $el.find("a > p").text();
			const quality = $el.find("a > p > strong").text();
			const type = $el.find("span.text-xs.capitalize").text();
			const detailsUrl = $el.find("a").attr("href");

			return {
				title,
				type,
				detailsUrl,
				quality: trim(quality, "()"),
			};
		})
		.toArray() as unknown as SearchEntry[];
}

async function scrapeMovie(entry: SearchEntry): Promise<MovieEntry> {
	const response = await axios.get(entry.detailsUrl);
	const $ = cheerio.load(response.data as string);

	const torrentUrl = $("a.text-sm.ml-2").attr("href");

	return { ...entry, torrentUrl };
}

async function scrapeSerie(entry: SearchEntry): Promise<SerieEntry> {
	const response = await axios.get(entry.detailsUrl);
	const $ = cheerio.load(response.data as string);

	const episodes = $("tr.border.border-gray-800")
		.map((_i, el) => {
			const $el = $(el);
			const episode = $el.find("td:nth-child(2)").text();
			const torrentUrl = $el.find("a").attr("href");

			return {
				episode: trim(trim(episode, "\n.-")),
				torrentUrl,
			};
		})
		.toArray() as unknown as SerieEntry["episodes"];

	return {
		...entry,
		episodes,
	};
}

export default async function search(queries: string[]): Promise<{
	movies: MovieEntry[];
	series: SerieEntry[];
}> {
	const entries = flat(await Promise.all(queries.map(searchByTitle)));

	// keep only movies and series
	const filteredEntries = entries.filter(({ type }) => type === MOVIE_TYPE || type === SERIES_TYPE);

	// fork into movies and series
	const [moviesEntries, seriesEntries] = fork(filteredEntries, ({ type }) => type === MOVIE_TYPE);

	// TODO: Handle single errors/exceptions gracefully
	const movies = await Promise.all(moviesEntries.map(scrapeMovie));
	const series = await Promise.all(seriesEntries.map(scrapeSerie));

	return { movies, series };
}
