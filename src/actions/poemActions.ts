import { RootThunkAction } from "../reducers/rootReducer";
import { makePrompt } from "../utils/utils";
import { generateEmotions, generateImage, generateKeywords, setIsFetchingImage, setIsFetchingPoem } from "./apiActions";

export const GAME_ACTION_NAMES = {
	SET_POEM: 'SET_POEM',
	SET_ERROR: 'SET_ERROR',
	SET_IMAGE: 'SET_IMAGE',
	SET_STYLE: 'SET_STYLE',
	SET_KEYWORDS: 'SET_KEYWORDS',
	SET_EMOTIONS: 'SET_EMOTIONS',
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
		dispatch(setIsFetchingPoem('fetching'));
		const keywords = await generateKeywords(p);
		const emotions = await generateEmotions(p);
		dispatch(setKeywords(keywords));
		dispatch(setEmotions(emotions));
		const prompt = makePrompt(keywords, emotions, style);

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
	return async (dispatch, getState) => {
		const state = getState();
		const emotions = state.main.emotions;
		const keywords = state.main.keywords;
		const poem = state.main.poem;
		dispatch(setStyle(style));

		const prompt = makePrompt([...keywords], [...emotions], style);
		console.log(prompt);
		dispatch(generateImage(poem, prompt));
	};
}

export interface SetKeywordsAction {
	type: typeof GAME_ACTION_NAMES.SET_KEYWORDS;
	value: string[];
}

function setKeywords(keywords: string[]): SetKeywordsAction {
	return {
		type: GAME_ACTION_NAMES.SET_KEYWORDS,
		value: keywords,
	};
}

export function saveKeywords(keywords: string[]): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setKeywords(keywords));
	};
}

export interface SetEmotionsAction {
	type: typeof GAME_ACTION_NAMES.SET_EMOTIONS;
	value: string[];
}

function setEmotions(emotions: string[]): SetEmotionsAction {
	return {
		type: GAME_ACTION_NAMES.SET_EMOTIONS,
		value: emotions,
	};
}

export function saveEmotions(emotions: string[]): RootThunkAction {
	return async (dispatch, _) => {
		dispatch(setEmotions(emotions));
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

export type PoemActions = SetPoemAction | SetErrorAction | SetImageAction | SetStyleAction | SetKeywordsAction | SetEmotionsAction;
