import { API_BASE_URL } from "../actions/apiActions";
import { saveError } from "../actions/poemActions";

export function imagePathToUrl(path: string) {
	if (path.substring(0, 4) == 'http' || path[0] == '#') {
		return path;
	}
	return `${API_BASE_URL}/client/pictures/${path}`;
}

export function makeError(msg: string) {
	console.error(msg);
	saveError(msg);
	return new Error(msg);
}

export function makePrompt(keywords: string[], emotions: string[], style: string) {
	return "picture of " + keywords.join(", ") + " with feelings of " + emotions.join(", ") + " in the style of " + style;
}