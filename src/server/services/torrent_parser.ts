import type { Instance } from "parse-torrent";
import { remote } from "parse-torrent";

export default async function parseTorrent(url: string): Promise<Instance | undefined> {
	return new Promise((resolve, reject) => {
		remote(url, (err, torrent?: Instance) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (err) {
				reject(err);
			}
			resolve(torrent);
		});
	});
}
