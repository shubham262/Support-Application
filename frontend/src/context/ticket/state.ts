/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { useReducer } from "react";

import { Actions } from "./action";
import Reducer from "./reducer";
import api from "../../service";
import axios from "axios";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export type Ticket = {
	id: string;
	title: string;
	description: string;
	status: TicketStatus;
	priority: TicketPriority;
	createdAt: string;
	updatedAt: string;
};

export type TicketComment = {
	id: string;
	ticketId: string;
	authorName: string;
	message: string;
	createdAt: string;
};

export type paginationType = {
	currentPage: number;
	hasNext: boolean;
	hasPrevious: boolean;
	limit: number;
	totalCount: number;
	totalPages: number;
};

export interface TicketInitialState {
	tickets: Ticket[] | null;
	ticketsPagination: paginationType | null;
	refetch: boolean;
	moreTickets: Ticket[] | null;
	fetchMore: boolean;
}

export const intialState: TicketInitialState = {
	tickets: null,
	moreTickets: null,
	ticketsPagination: null,
	refetch: false,
	fetchMore: false,
};

export const TicketContextState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const fetchTickets = async (params: string, fetchMore: boolean = false) => {
		try {
			const url = "/tickets" + params;
			const { data } = await api.get(url);
			dispatch({
				type: fetchMore
					? Actions.FETCH_MORE_TICKET_DETAILS
					: Actions.FETCH_TICKET_DETAILS,
				payload: { ...data },
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};
	const createTicket = async (payload: any) => {
		try {
			const { data } = await api.post("/tickets/create", payload);
			if (data?.ticket) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};

	const fetchTicketDetails = async (ticketId: string) => {
		try {
			const { data } = await api.get(`/tickets/${ticketId}`);

			if (data?.ticket) {
				return [true, data?.ticket];
			} else {
				return [false];
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};

	const updateTicket = async (ticketId: string, payload: any) => {
		try {
			const { data } = await api.put(`/tickets/${ticketId}`, payload);
			if (data?.ticket) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};
	const deleteTicket = async (ticketId: string) => {
		try {
			await api.delete(`/tickets/${ticketId}`);
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};

	const deleteComment = async (commentId: string) => {
		try {
			await api.delete(`/comments/${commentId}`);
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};

	const addComment = async (ticketId: string, payload: any) => {
		try {
			const { data } = await api.post(`/comments/${ticketId}`, payload);
			console.log("data", data);
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Something went wrong";
				throw { message };
			}
		}
	};

	const updateTicketState = async (payload: Object) => {
		try {
			dispatch({ type: Actions.UPDATE_TICKET_STATE, payload });
		} catch (error) {
			console.log("error==>updateCollabState", error);
		}
	};

	const resetTicketState = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log("error==>resetCollabState", error);
		}
	};

	return {
		...state,
		updateTicketState,
		resetTicketState,
		fetchTickets,
		createTicket,
		updateTicket,
		fetchTicketDetails,
		deleteTicket,
		deleteComment,
		addComment,
	};
};
