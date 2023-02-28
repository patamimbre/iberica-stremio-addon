import type { Cache, ContentType, Stream } from "stremio-addon-sdk";

import Server from "../server";
import parseTorrent from "../server/services/torrent_parser";
import { Entry } from "../server/types";

const ADDON_NAME = "Iberica";

export default async function (args: {
	type: ContentType;
	id: string;
}): Promise<{ streams: Stream[] } & Cache> {
	const { type, id } = args;

	if (type !== "movie" && type !== "series") {
		return Promise.resolve({ streams: [] });
	}

	const [ttId, season, episode] = id.split(":");

	const entries: Entry[] = await (type === "movie"
		? Server.getMovie(ttId)
		: Server.getSerie(ttId, parseInt(season, 10), parseInt(episode, 10)));

	if (!entries.length) {
		return Promise.resolve({ streams: [] });
	}

	const entriesWithTorrent = await Promise.all(
		entries.map(async (entry) => ({
			...entry,
			torrent: await parseTorrent(entry.torrentUrl),
		}))
	);

	const streams: Stream[] = entriesWithTorrent
		.filter(({ torrent }) => torrent)
		.map(
			(entry) =>
				({
					infoHash: entry.torrent?.infoHash,
					name: `${ADDON_NAME}\n${entry.quality}`,
					// TODO: Better to use the name from the torrent (instead of entry)
					// TODO: Add more info to the title like the size of the torrent and the number of seeds
					title:
						entry.title +
						(entry.season && entry.episode ? ` - S${entry.season}E${entry.episode}` : ""),
				} as Stream)
		);

	return Promise.resolve({ streams });
}
