import { APIActions, API_ACTION_NAMES, SetIsFetchingImageAction, SetIsFetchingPoemAction } from './../actions/apiActions';
export type FetchStatus = 'inactive' | 'fetching' | 'success' | 'failure';

export interface APIState {
	isFetchingImage: FetchStatus;
	isFetchingPoem: FetchStatus;
}

export const initialState: APIState = {
	isFetchingImage: 'inactive',
	isFetchingPoem: 'inactive',
};

export function reducer(state = initialState, action: APIActions): APIState {
	switch (action.type) {
		case API_ACTION_NAMES.SET_IS_FETCHING_IMAGE: {
			const { value } = action as SetIsFetchingImageAction;
			return {
				...state,
				isFetchingImage: value,
			};
		} case API_ACTION_NAMES.SET_IS_FETCHING_POEM: {
			const { value } = action as SetIsFetchingPoemAction;
			return {
				...state,
				isFetchingPoem: value,
			};
		} default:
			return state;
	}
}
