import styles from "./assets/styles/home.module.scss";
import { useContextState } from "./context/ContextState";
import type { Ticket } from "./context/ticket/state";
import Header from "./components/Header";
import Tickets, { TicketSkeleton } from "./components/Tickets";
import Controls from "./components/Controls";
import { memo, useCallback, useEffect, useState } from "react";

type paginationType = {
	currentPage: number;
	hasNext: boolean;
	hasPrevious: boolean;
	limit: number;
	totalCount: number;
	totalPages: number;
};

const App = () => {
	const {
		ticketInfo: {
			tickets,
			ticketsPagination,
			updateTicketState,
			fetchMore,
			moreTickets,
		},
	}: any = useContextState();

	const [info, setInfo] = useState<{
		loading: boolean;
		ticketsData: Ticket[];
		pagination: paginationType | null;
	}>({
		loading: true,
		ticketsData: [],
		pagination: null,
	});

	useEffect(() => {
		if (tickets) {
			const ticketData = tickets?.tickets || [];

			setInfo((prev) => ({
				...prev,
				ticketsData: ticketData,
				loading: false,
			}));
		}
	}, [tickets]);

	useEffect(() => {
		if (moreTickets) {
			const ticketData = moreTickets?.tickets || [];

			setInfo((prev) => ({
				...prev,
				ticketsData: prev.ticketsData.concat(ticketData),
				loading: false,
			}));
		}
	}, [moreTickets]);

	useEffect(() => {
		if (ticketsPagination) {
			setInfo((prev) => ({
				...prev,
				pagination: ticketsPagination,
			}));
		}
	}, [ticketsPagination]);

	const handleFetchMore = useCallback(() => {
		if (fetchMore) {
			return;
		}
		updateTicketState({ fetchMore: true });
	}, [updateTicketState, fetchMore]);

	return (
		<div className={styles.page}>
			<Header />

			<Controls />

			{info?.loading ? (
				<div className={styles.cardGrid}>
					{Array.from({ length: 12 }).map((_, index) => (
						<TicketSkeleton key={`skeleton-${index}`} />
					))}
				</div>
			) : (
				<>
					<div className={styles.cardGrid}>
						{info?.ticketsData.map((ticket: Ticket) => (
							<Tickets key={ticket.id} ticket={ticket} />
						))}
					</div>
					{info?.ticketsData?.length === 0 && (
						<div className={styles.emptyState}>
							<h3>No tickets found</h3>
							<p>
								Try adjusting the search or clearing one of the filters,you can
								even add tickets.
							</p>
						</div>
					)}

					{info?.pagination?.hasNext && (
						<div className={styles.loadMoreWrapper}>
							<button
								className={styles.loadMoreButton}
								type="button"
								onClick={handleFetchMore}
							>
								{fetchMore ? "Fetching ..." : "Load more"}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default memo(App);
