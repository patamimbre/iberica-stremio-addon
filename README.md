# Iberica Addon for Stremio (Work in Progress) 🎥🎬
This is an addon for [Stremio](https://www.stremio.com/) that allows you to search for movies and TV shows on [Mejortorrent](https://mejortorrent.wtf/), a popular torrent website. Please note that this addon is **still a work in progress**, so there may be bugs and missing features.

## Getting Started 🚀
To get started with Iberica addon, you'll need to have Node.js and Stremio installed on your computer.

- Clone [this repository](https://github.com/Stremio/stremio-addon-sdk) to your local machine using git clone: `git clone https://github.com/patamimbre/iberica-addon.git`
- Navigate to the root directory of the project in your terminal.
- Run `npm install` to install all dependencies.
- Copy the `.env.example` file and rename it to `.env`.
- Edit the `.env` file and add the required variables.
- Start the server with `npm run dev`.

## Running the Development Server 🌡️
Once you've installed the dependencies and created your `.env` file, you can start the development server by running `npm run dev` in your terminal. This will start a local server at http://localhost:8899.

See the [Stremio documentation](https://github.com/Stremio/stremio-addon-sdk) for more information on how to add your local addon to Stremio.

## Feedback 💬
If you encounter any bugs or have suggestions for new features, please open an issue on the GitHub repository. We appreciate any and all feedback!

## Remaining Tasks 📝
- [ ] Display torrent info (size, seeders, leechers, etc.)
- [ ] Properly handle entries without torrent url (from Mejortorrent)
- [ ] Handle errors/exceptions gracefully
- [ ] Tests
- [ ] Publish to Stremio Addon Catalog