/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from "axios";
import * as env from "env-var";
import { flat, unique } from "radash";

const TMDB_API_KEY = env.get("TMDB_API_KEY").required().asString();

const BASE_URL = "https://api.themoviedb.org/3/";

export default async function ttIdToTitles(ttId: string): Promise<string[]> {
	const url = `${BASE_URL}find/${ttId}?api_key=${TMDB_API_KEY}&language=es-ES&external_source=imdb_id`;
	const response = await axios.get(url);

	const { movie_results, tv_results } = response.data;

	const titles = [...movie_results, ...tv_results].map(
		({ title, original_title, name, original_name }: any) => [
			title,
			original_title,
			original_name,
			name,
		]
	);

	return unique(flat(titles as string[][]).filter(Boolean));
}
