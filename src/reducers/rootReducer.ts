import { APIActions } from './../actions/apiActions';
import { Action, combineReducers, Reducer } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { APIState, initialState as apiInitialState, reducer as apiReducer } from './apiReducer';
import { PoemActions } from '../actions/poemActions';
import { PoemState, initialState as mainInitialState, reducer as poemReducer } from './poemReducer';

export interface State {
	main: PoemState;
	api: APIState;
}

export type RootThunkAction = ThunkAction<Promise<void>, State, unknown, Action<string>>;
export type Actions = PoemActions | APIActions;
export type RootDispatch = ThunkDispatch<State, unknown, Actions>;

export const rootReducer: Reducer<State, Actions> = combineReducers({
	main: poemReducer,
	api: apiReducer,
});

export const initialState: State = {
	main: mainInitialState,
	api: apiInitialState,
};

/* Brainstorming list of all actions:
 * - We need a way to move between story steps. This sometimes depends on first
 *   inputting something.
 * - Restart the experience. Restore everything to its initial state.
 * - Await response from the WOZ client. How do we do that? Polling? Ew.
 * - The WOZ client also has to await responses from the participant client.
 * - 
 */
