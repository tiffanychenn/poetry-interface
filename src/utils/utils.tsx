import { API_BASE_URL } from "../actions/apiActions";

export function imagePathToUrl(path: string) {
	if (path.substring(0, 4) == 'http' || path[0] == '#') {
		return path;
	}
	return `${API_BASE_URL}/client/data/${path}`;
}