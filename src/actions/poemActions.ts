import { RootThunkAction } from "../reducers/rootReducer";
import { generateEmotions, generateImage, generateKeywords, setIsFetchingImage } from "./apiActions";

export const GAME_ACTION_NAMES = {
	SET_POEM: 'SET_POEM',
	SET_ERROR: 'SET_ERROR',
	SET_IMAGE: 'SET_IMAGE',
	SET_STYLE: 'SET_STYLE'
};

export interface SetPoemAction {
	type: typeof GAME_ACTION_NAMES.SET_POEM;
	value: string;
}

function setPoem(poem: string): SetPoemAction {
	return {
		type: GAME_ACTION_NAMES.SET_POEM,
		value: poem,
	};
}

export function savePoem(poem: string): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setPoem(poem));
	};
}

export function evaluatePoem(p: string): RootThunkAction {
	return async (dispatch, getState) => {
		const state = getState();
		const style = state.main.style;

		dispatch(setPoem(p));

		// grab main poem picture
		dispatch(setIsFetchingImage('fetching'));
		const keywords = await generateKeywords(p);
		const emotions = await generateEmotions(p);
		const prompt = "picture of " + keywords.join(", ") + " with feelings of " + emotions.join(", ") + " in the style of " + style;

		console.log(prompt);
		dispatch(generateImage(p, prompt));
	};
}

export interface SetErrorAction {
	type: typeof GAME_ACTION_NAMES.SET_ERROR;
	value: string;
}

function setError(error: string): SetPoemAction {
	return {
		type: GAME_ACTION_NAMES.SET_ERROR,
		value: error,
	};
}

export function saveError(error: string): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setError(error));
	};
}

export interface SetStyleAction {
	type: typeof GAME_ACTION_NAMES.SET_STYLE;
	value: string;
}

function setStyle(style: string): SetStyleAction {
	return {
		type: GAME_ACTION_NAMES.SET_ERROR,
		value: style,
	};
}

export function saveStyle(style: string): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setStyle(style));
	};
}

export interface SetImageAction {
	type: typeof GAME_ACTION_NAMES.SET_IMAGE;
	prompt: string,
	path: string,
}

export function setImage(prompt: string, path: string): SetImageAction {
	return {
		type: GAME_ACTION_NAMES.SET_IMAGE,
		prompt,
		path
	};
}

export function saveImage(prompt: string, path: string): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setImage(prompt, path));
	};
}

export type PoemActions = SetPoemAction | SetErrorAction | SetImageAction;
