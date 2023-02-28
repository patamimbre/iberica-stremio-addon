import "dotenv/config";

import * as env from "env-var";
import { addonBuilder as AddonBuilder, serveHTTP } from "stremio-addon-sdk";

import manifest from "./addon/manifest";
import streamHandler from "./addon/streamHandler";

const port = env.get("PORT").default(9966).asPortNumber();

const builder = new AddonBuilder(manifest);
builder.defineStreamHandler(streamHandler);

serveHTTP(builder.getInterface(), { port });
//publishToCentral("https://your-domain/manifest.json") // <- invoke this if you want to publish your addon and it's accessible publically on "your-domain"
