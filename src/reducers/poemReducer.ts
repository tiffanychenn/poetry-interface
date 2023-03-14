import { PoemActions, GAME_ACTION_NAMES, SetErrorAction, SetPoemAction, SetImageAction, SetStyleAction, SetKeywordsAction, SetEmotionsAction } from '../actions/poemActions';

export interface PoemState {
	poem: string,
	error: string,
	images: {[key: string]: string},
	keywords: string[],
	emotions: string[],
	style: string,
}

export const initialState: PoemState = {
	poem: "",
	error: "",
	images: {},
	keywords: [],
	emotions: [],
	style: "watercolor",
};

export function reducer(state = initialState, action: PoemActions): PoemState {
	switch (action.type) {
		case GAME_ACTION_NAMES.SET_POEM: {
			const { value } = action as SetPoemAction;
			return {
				...state,
				poem: value,
			};
		} case GAME_ACTION_NAMES.SET_ERROR: {
			const { value } = action as SetErrorAction;
			return {
				...state,
				error: value,
			};
		} case GAME_ACTION_NAMES.SET_STYLE: {
			const { value } = action as SetStyleAction;
			return {
				...state,
				style: value,
			};
		} case GAME_ACTION_NAMES.SET_KEYWORDS: {
			const { value } = action as SetKeywordsAction;
			return {
				...state,
				keywords: [...value],
			};
		} case GAME_ACTION_NAMES.SET_EMOTIONS: {
			const { value } = action as SetEmotionsAction;
			return {
				...state,
				emotions: [...value],
			};
		} case GAME_ACTION_NAMES.SET_IMAGE: {
			const { prompt, path } = action as SetImageAction;
			const newSectionImageUrls = Object.assign({}, state.images);
			newSectionImageUrls[prompt] = path;
			return {
				...state,
				images: newSectionImageUrls,
			};
		} default:
			return state;
	}
}
