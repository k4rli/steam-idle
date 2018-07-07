require('dotenv').config();
const Steam = require('steam');
const SteamTotp = require('steam-totp');

const steamClient = new Steam.SteamClient();
const steamUser = new Steam.SteamUser(steamClient);
const steamFriends = new Steam.SteamFriends(steamClient);

const account_name = process.env.steam_username;
const password = process.env.steam_password;
let two_factor_code = '';
if (process.env.shared_secret !== undefined) {
	two_factor_code = SteamTotp.generateAuthCode(process.env.shared_secret);
}

const games_played = [
	{ game_id: 10 }, // cs 1.6
	{ game_id: 730 }, // csgo
	{ game_id: 346900 }, // adventure capitalist
	{ game_id: 440 }, // TF2
	{ game_id: 271590 }, // gta 5
	{ game_id: 255710 }, // cities skylines
	{ game_id: 44350 }, // grid 2
	{ game_id: 321040 }, // DiRT 3
	{ game_id: 252490 }, // rust
	{ game_id: 228760 }, // tm canyon
	{ game_id: 287340 }, // colin mcrae
	{ game_id: 24240 }, // payday
	{ game_id: 286570 }, // f1
	{ game_id: 201700 }, // dirt showdown
	{ game_id: 11020 }, // tm nations
	{ game_id: 458260 }, // psha bicep
	{ game_id: 7200 }, // tm united
];

function logIdle() {
	let d = new Date();
	console.log('\n\n\n\n\n\n\n\n\n\n\n');
	console.log('     ██╗██████╗ ██╗     ██╗███╗   ██╗ ██████╗     ███████╗████████╗ █████╗ ██████╗ ████████╗███████╗██████╗ ');
	console.log('     ██║██╔══██╗██║     ██║████╗  ██║██╔════╝     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗');
	console.log('     ██║██║  ██║██║     ██║██╔██╗ ██║██║  ███╗    ███████╗   ██║   ███████║██████╔╝   ██║   █████╗  ██║  ██║');
	console.log('     ██║██║  ██║██║     ██║██║╚██╗██║██║   ██║    ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   ██╔══╝  ██║  ██║');
	console.log('     ██║██████╔╝███████╗██║██║ ╚████║╚██████╔╝    ███████║   ██║   ██║  ██║██║  ██║   ██║   ███████╗██████╔╝');
	console.log('     ╚═╝╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ ');
	console.log('\n\n');
	console.log(`    * Start time: ${d.toGMTString()} * `);
	console.log('\n');
	console.log(`    * Username: ${account_name} * `);
	console.log('\n\n');
	console.log('\n\n\n\n\n\n\n\n\n\n\n');
}

function startIdle() {
	const logInParams = {
		account_name,
		password,
	}
	if (two_factor_code !== '') logInParams.two_factor_code = two_factor_code;
	// LOGGING IN
	steamClient.connect();
	steamClient.on('connected', () => {
		steamUser.logOn(logInParams);
	});

	// STARTING IDLE
	steamClient.on('logOnResponse', (logOnResponse) => {
		if (logOnResponse.eresult === Steam.EResult.OK) {
			// DOESN*T SHOW ACCOUNT AS ONLINE
			steamFriends.setPersonaState(Steam.EPersonaState.Offline);
			steamUser.gamesPlayed({
				games_played,
			});
			logIdle();
		}
	});
	steamClient.on('error', (err) => {
		const d = new Date();
		console.log(`    * Error time: ${d.toGMTString()} * `);
		console.log(`Error occurred: ${err}`);
	});
}

startIdle();
