import { DEBUG_MODE } from "../components/App/App";
import { FetchStatus } from "../reducers/apiReducer";
import { RootThunkAction } from "../reducers/rootReducer";
import { makeError } from "../utils/utils";
import { saveError, saveImage, setImage } from './poemActions';

export const API_ACTION_NAMES = {
	SET_IS_FETCHING_IMAGE: 'SET_IS_FETCHING_IMAGE',
};

const PORT = 5000;
export const API_BASE_URL = `http://localhost:${PORT}`;

const NUM_KEYWORDS = 6;
const NUM_EMOTIONS = 3;

export interface SetIsFetchingAction {
	type: typeof API_ACTION_NAMES.SET_IS_FETCHING_IMAGE;
	value: FetchStatus;
}

export function setIsFetchingImage(value: FetchStatus): SetIsFetchingAction {
	return {
		type: API_ACTION_NAMES.SET_IS_FETCHING_IMAGE,
		value,
	};
}

export function generateImage(poem: string, prompt: string): RootThunkAction {
	return async (dispatch, getState) => {
		if (DEBUG_MODE) {
			console.log(`generateImage: Currently in debug mode, so no image will be generated. Prompt (or command) that would have been used:\n${prompt}`);
			dispatch(setIsFetchingImage('success'));
			return;
		}		

		const state = getState();
		const endpoint = "image-gen";

		// Handle special prompts (take care of this when i better know what i want the UI to look like)
		// let finalPrompt = prompt;
		// let pathToVary = undefined;
		// if (prompt[0] == "!") {
		// 	console.log(`generateImage: Using the following prompt as command: ${prompt}`);
		// 	if (prompt.substring(0,5) == '!redo') {
		// 		// Retrieve a prompt from a previous section, and regenerate it.
		// 		const argSectionIndex = parseInt(prompt[5]);
		// 		if (isNaN(argSectionIndex)) throw makeError(`generateImage failed to execute command ${prompt}: an invalid section index argument was provided.`);
		// 		const argSectionImageUrl = state.prompt.sectionImageUrls[argSectionIndex];
		// 		if (!argSectionImageUrl) throw makeError(`generateImage failed to execute command ${prompt}: no section image could be found for section ${argSectionIndex}.`);
		// 		finalPrompt = argSectionImageUrl.filledPrompt;
		// 	} else if (prompt.substring(0,5) == '!keep') {
		// 		// Retrieve an image from a previous section, and simply keep it without regenerating.
		// 		const argSectionIndex = parseInt(prompt[5]);
		// 		if (isNaN(argSectionIndex)) {
		// 			throw makeError(`generateImage failed to execute command ${prompt}: an invalid section index argument was provided.`);
		// 		}
				
		// 		dispatch(setIsFetchingImage('fetching'));

		// 		const keepPrevImage = () => {
		// 			const argSectionImageUrl = state.prompt.sectionImageUrls[argSectionIndex];
		// 			if (!argSectionImageUrl) {
		// 				throw makeError(`generateImage failed to execute command ${prompt}: no section image could be found for section ${argSectionIndex}.`);
		// 			}
		// 			dispatch(saveImage(sectionIndex, argSectionImageUrl.filledPrompt, argSectionImageUrl.path));
		// 			dispatch(setIsFetchingImage('success'));
		// 		};

		// 		const argPretendTimeout = prompt[6];
		// 		if (argPretendTimeout == 't') {
		// 			setTimeout(keepPrevImage, FAKE_MINIMUM_GENERATE_TIME);
		// 		} else {
		// 			keepPrevImage();
		// 		}
		// 		return;
		// 		// Early return since no DALL-E generation is required
		// 	} else if (prompt.substring(0,5) == '!vary') {
		// 		// Generate a variation of a previous section.
		// 		const argSectionIndex = parseInt(prompt[5]);
		// 		if (isNaN(argSectionIndex)) throw makeError(`generateImage failed to execute command ${prompt}: an invalid section index argument was provided.`);
		// 		const argSectionImageUrl = state.prompt.sectionImageUrls[argSectionIndex];
		// 		if (!argSectionImageUrl) throw makeError(`generateImage failed to execute command ${prompt}: no section image could be found for section ${argSectionIndex}.`);
		// 		pathToVary = argSectionImageUrl.path;
		// 	}
		// }

		const body = {
			prompt: prompt
		}

		dispatch(setIsFetchingImage('fetching'));

		fetch(`${API_BASE_URL}/${endpoint}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				},
		}).then((response) => response.json())
		.then((data) => {
			const returnedImgPath = data.imageURL;
			console.log("generateImage received successful response from API; potentially delaying state propagation.\nResponse: " + returnedImgPath);
			dispatch(setImage(poem, returnedImgPath));
			dispatch(setIsFetchingImage('success'));
		}).catch(reason => {
			throw makeError("API failed to generate image for prompt: " + prompt + "\nReason: " + reason);
		});
	};
}

export async function generateKeywords(poem: string): Promise<string[]> {
	if (DEBUG_MODE) {
		console.log(`generateKeywords: Currently in debug mode, so no keywords will be generated.`);
		await setTimeout(() => {}, 5000);
		return ["keyword1", "keyword2"];
	}
	const body = {
		poem: poem,
		num_keywords: NUM_KEYWORDS
	}
	return fetch(`${API_BASE_URL}/keywords`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			},
	}).then((response) => response.json())
	.then((data) => {
		return data.keywords;
	}).catch(reason => {
		return [];
	});
}

export async function generateEmotions(poem: string): Promise<string[]> {
	if (DEBUG_MODE) {
		console.log(`generateEmotions: Currently in debug mode, so no emotions will be generated.`);
		await setTimeout(() => {}, 5000);
		return ["emotion1", "emotion2"];
	}
	const body = {
		poem: poem,
		num_emotions: NUM_EMOTIONS
	}
	return fetch(`${API_BASE_URL}/emotions`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			},
	}).then((response) => response.json())
	.then((data) => {
		return data.emotions;
	}).catch(reason => {
		return [];
	});
}

export type APIActions = SetIsFetchingAction;
