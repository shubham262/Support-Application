import { useMemo } from "react";

import { TicketContextState } from "./ticket/state";

const useCombineState = () => {
	// Call all hooks at the top level
	const ticketInfo = TicketContextState();

	return useMemo(
		() => ({
			ticketInfo,
		}),
		[ticketInfo]
	);
};

export default useCombineState;
