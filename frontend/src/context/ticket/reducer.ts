/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actions } from "./action";
import { type TicketInitialState, intialState } from "./state";

interface Action {
	type: string;
	payload?: any;
}

type Handler = (
	state: TicketInitialState,
	action: Action
) => TicketInitialState;

const actionHandlers: Record<string, Handler> = {
	[Actions.UPDATE_TICKET_STATE]: (state, action) => ({
		...state,
		...action.payload,
	}),
	[Actions.FETCH_TICKET_DETAILS]: (state, action) => ({
		...state,
		tickets: action.payload || {},
		ticketsPagination: action?.payload?.pagination || {},
	}),

	[Actions.FETCH_MORE_TICKET_DETAILS]: (state, action) => ({
		...state,
		moreTickets: action.payload || {},
		ticketsPagination: action?.payload?.pagination || {},
		fetchMore: false,
	}),

	[Actions.RESET_STATE]: () => ({ ...intialState }),
};

const Reducer = (state: TicketInitialState, action: Action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
