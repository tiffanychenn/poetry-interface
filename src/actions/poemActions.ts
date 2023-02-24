import { RootThunkAction } from "../reducers/rootReducer";

export const GAME_ACTION_NAMES = {
	SET_POEM: 'SET_POEM',
	SET_ERROR: 'SET_ERROR',
	SET_IMAGE: 'SET_IMAGE',
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

export interface SetImageAction {
	type: typeof GAME_ACTION_NAMES.SET_IMAGE;
	prompt: string,
	path: string,
}

function setImage(prompt: string, path: string): SetImageAction {
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
