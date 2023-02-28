import { flat, trim } from "radash";

import { Entry } from "../types";
import { MovieEntry, SerieEntry } from "./mejortorrent";

export const MOVIE = "movie";
export const SERIE = "serie";

function cleanTitle(title: string) {
	return title
		.replace(/\s?\(.+\)\s?$/, "")
		.replace(/\s?\[.+\]\s?$/, "")
		.replace(/\s?-\s.+\s?$/, "")
		.trim();
}

function getSeasonAndEpisodes(episodeInfo: string): [number, number | undefined][] {
	const trimmed = trim(trim(episodeInfo, "-"));

	// Multiple weird cases here:

	// "Blah blah blah - 1º Temporada - completa" or weird stuff like that
	if (trimmed.toLowerCase().includes("temporada") || trimmed.toLowerCase().includes("completa")) {
		// then get N like "(N)[º|ª]\s[T|t]emporada"
		const season = trimmed.match(/(\d+)[º|ª]?\s[T|t]emporada/)?.[1];
		if (!season) {
			return [];
		}

		return [[parseInt(season, 10), undefined]];
	}

	// 21x01 al 21x03 or 21x01 y 21x02

	// first try to split by "a" or "al" or "y"
	const [firstBlock, secondBlock] = trimmed.split(/a|al|y/);

	// if there is a second block, then it's a range. Otherwise, it's a single episode
	if (!secondBlock) {
		const [s, e] = firstBlock.split("x");

		return [[parseInt(s, 10), parseInt(e, 10)]];
	}

	// Its a range then. Get the first episode and the last episode
	const [season1, episode1] = firstBlock.split("x");
	const [_, episode2] = secondBlock.split("x");

	// Generate an array with all the episodes in the range
	const episodes = Array.from(
		{ length: parseInt(episode2, 10) - parseInt(episode1, 10) + 1 },
		(_, i) => i + parseInt(episode1, 10)
	);

	const season = parseInt(season1, 10);

	return episodes.map((e) => [season, e]);
}

export function convertMovieToEntry(ttId: string, movie: MovieEntry): Entry {
	const { title, torrentUrl, quality } = movie;

	return {
		ttId,
		title: cleanTitle(title),
		torrentUrl,
		quality,
		season: undefined,
		episode: undefined,
	} as Entry;
}

export function convertSerieToEntries(ttId: string, serie: SerieEntry): Entry[] {
	const { title, quality, episodes } = serie;

	const base = {
		ttId,
		title: cleanTitle(title),
		quality,
		type: SERIE,
	};

	const allData = episodes.map((episode) => {
		const { episode: episodeInfo, torrentUrl } = episode;

		const seasonsAndEpisodes = getSeasonAndEpisodes(episodeInfo);

		// TODO: Properly handle entries without torrentUrl (in mejortorrent.ts)
		return seasonsAndEpisodes.map(([season, episode]) => ({
			...base,
			season,
			episode,
			torrentUrl: torrentUrl ?? "",
		}));
	});

	return flat(allData);
}
