import { type ClassValue, clsx } from "clsx";
import _slugify from "slugify";
import { twMerge } from "tailwind-merge";
import { type Version7Options, v7 } from "uuid";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function uuid(opts?: Version7Options) {
	return v7(opts);
}

export function slugify(rawString: string) {
	return _slugify(rawString, {
		lower: true,
		replacement: "-",
		strict: true,
		trim: true,
	});
}

const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });

const ordinalSuffixes: Record<Intl.LDMLPluralRule, string> = {
	zero: "",
	one: "st",
	two: "nd",
	few: "rd",
	other: "th",
	many: "",
};
export function ordinalSuffix(num: number) {
	const rule = ordinalRules.select(num);
	const suffix = ordinalSuffixes[rule];
	return `${num}${suffix}`;
}

export const INTERNAL_HOSTS = new Set([
	"www.hicoracetiming.com",
	"hicoracetiming.com",
	"localhost",
	"127.0.0.1",
]);

export const stateAbbreviations = z.enum([
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
]);

export function secondsToTimestamp(
	totalSeconds: number,
	padHour = false,
	padMin = true,
	padSec = true,
) {
	const seconds = Math.floor(totalSeconds % 60);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const minutes = totalMinutes % 60;
	const hours = Math.floor(totalMinutes / 60);

	const fmt = (n: number, pad: boolean) =>
		pad ? n.toString().padStart(2, "0") : `${n}`;

	if (hours > 0) {
		return `${fmt(hours, padHour)}:${fmt(minutes, padMin)}:${fmt(seconds, padSec)}`;
	}
	return `${fmt(minutes, padMin)}:${fmt(seconds, padSec)}`;
}

export const KM_PER_MILE = 1.609344;

export function paceFromTimeAndDistance(
	totalSeconds: number,
	distanceKm: string,
) {
	const _distanceKm = parseFloat(distanceKm);
	const distanceMiles = _distanceKm / KM_PER_MILE;

	const pacePerKm = totalSeconds / _distanceKm;
	const pacePerMile = totalSeconds / distanceMiles;

	return { pacePerKm, pacePerMile };
}
