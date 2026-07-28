import { faker } from "@faker-js/faker";

const ORDINALS = [
	"1st",
	"2nd",
	"3rd",
	"4th",
	"5th",
	"6th",
	"7th",
	"8th",
	"9th",
	"10th",
	"11th",
	"12th",
	"15th",
	"20th",
	"25th",
	"30th",
];

const HOLIDAY_THEMES = [
	"Turkey Trot",
	"Firecracker",
	"Shamrock",
	"Jingle Bell",
	"Reindeer",
	"Cupid's Chase",
	"Groundhog",
	"Polar Bear",
	"Pumpkin Patch",
	"Candy Cane",
	"Resolution",
	"Frosty",
	"Harvest Moon",
	"Cherry Blossom",
	"May Day",
	"Autumn Leaves",
	"Snowflake",
	"Eggnog Jog",
	"Fourth of July",
	"Labor Day",
];

const NATURE_THEMES = [
	"Coyote",
	"Rattlesnake",
	"Bear Chase",
	"Wildflower",
	"Sunflower",
	"Dogwood",
	"Prairie Fire",
	"River Bend",
	"Timberline",
	"Canyon",
	"Ridgeline",
	"Wild Horse",
	"Eagle Ridge",
	"Bluebonnet",
	"Magnolia",
	"Cottonwood",
	"Red Fox",
	"Bison",
	"Hawkwatch",
	"Silver Creek",
];

const TIME_THEMES = [
	"Midnight Madness",
	"Sunrise",
	"Moonlight",
	"Twilight",
	"Dawn Patrol",
	"Starlight",
	"Night Owl",
	"First Light",
	"Daybreak",
	"Lantern",
];

const LOCATION_THEMES = [
	"Downtown",
	"Riverside",
	"Lakefront",
	"Harborfront",
	"Old Town",
	"Uptown",
	"Bridge",
	"Hillcrest",
	"Meadowbrook",
	"Parkside",
];

const CAUSE_THEMES = [
	"Race for the Cure",
	"Run for the Fallen",
	"Hope",
	"Heroes",
	"Champions",
	"Miracle",
	"Believe",
	"Freedom",
	"Community Spirit",
	"Unity",
];

const ADJECTIVES = [
	"Great",
	"Wicked",
	"Reckless",
	"Rugged",
	"Mighty",
	"Epic",
	"Blazing",
	"Roaring",
	"Wild",
	"Renegade",
	"Fearless",
	"Relentless",
	"Gritty",
	"Thunder",
	"Iron",
	"Golden",
	"Rustic",
	"Stampeding",
];

const EVENT_TYPES = [
	"Run",
	"Dash",
	"Trot",
	"Shuffle",
	"Stampede",
	"Chase",
	"Sprint",
	"Classic",
	"Challenge",
	"Charge",
	"Rally",
	"Romp",
	"Scramble",
	"Jog",
	"Fun Run",
	"Race",
	"Gallop",
	"Hustle",
];

const THEME_BANKS = [
	HOLIDAY_THEMES,
	NATURE_THEMES,
	TIME_THEMES,
	LOCATION_THEMES,
	CAUSE_THEMES,
];

const pick = faker.helpers.arrayElement;

function pickTheme() {
	return pick(pick(THEME_BANKS));
}

const templates = [
	() => `${pick(ORDINALS)} Annual ${pickTheme()} ${pick(EVENT_TYPES)}`,
	() => `${pickTheme()} ${pick(EVENT_TYPES)}`,
	() => `${pick(ADJECTIVES)} ${pickTheme()} ${pick(EVENT_TYPES)}`,
	() => `${pick(LOCATION_THEMES)} ${pick(EVENT_TYPES)}`,
	() => `${pick(TIME_THEMES)} ${pick(EVENT_TYPES)}`,
	() => `${pick(ORDINALS)} Annual ${pick(CAUSE_THEMES)}`,
	() =>
		`${pick(NATURE_THEMES)} ${pick(EVENT_TYPES)} ${pick(["Classic", "Challenge", ""]).trim()}`.trim(),
	() => `${pick(ADJECTIVES)} ${pick(EVENT_TYPES)}`,
];

export function generateEventNames(amount: number) {
	const results: string[] = [];
	const seen = new Set();

	const maxAttempts = amount * 50;
	let attempts = 0;

	while (results.length < amount && attempts < maxAttempts) {
		attempts++;
		const template = pick(templates);
		const name = template().replace(/\s+/g, " ").trim();

		if (seen.has(name)) continue;
		seen.add(name);
		results.push(name);
	}

	return results;
}
