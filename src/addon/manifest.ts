import { Manifest } from "stremio-addon-sdk";

export default {
	id: "org.patamimbre.iberica",
	version: "1.0.0",
	name: "Iberica",
	description: "Iberica addon",

	// Properties that determine when Stremio picks this addon
	// this means your addon will be used for streams of the type movie
	catalogs: [],
	resources: ["stream"],
	types: ["movie", "series"],
	idPrefixes: ["tt"],
} as Manifest;
