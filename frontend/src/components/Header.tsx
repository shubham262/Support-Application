import { useContextState } from "../context/ContextState";
import styles from "../assets/styles/header.module.scss";
import type { Ticket } from "../context/ticket/state";
import { useEffect, useState } from "react";
const Header = () => {
	const {
		ticketInfo: { tickets },
	}: any = useContextState();

	const [info, setInfo] = useState<{
		loading: boolean;
		ticketsData: Ticket[];
	}>({
		loading: true,
		ticketsData: [],
	});

	useEffect(() => {
		if (tickets) {
			const ticketData = tickets?.tickets || [];
			const pagination = tickets?.pagination || {};
			setInfo((prev) => ({
				...prev,
				ticketsData: ticketData,
				pagination,
				loading: false,
			}));
		}
	}, [tickets]);

	return (
		<div className={styles.header}>
			<div>
				<p className={styles.kicker}>Support Desk</p>
				<h1 className={styles.title}>Ticket Command Center</h1>
				<p className={styles.subtitle}>
					Create, view, and manage tickets with clarity. Stay on top of what
					matters most.
				</p>
			</div>
			<div className={styles.summaryCard}>
				<div>
					<p className={styles.summaryLabel}>Total tickets</p>
					<p className={styles.summaryValue}>{info?.ticketsData?.length}</p>
				</div>
				<div>
					<p className={styles.summaryLabel}>Open</p>
					<p className={styles.summaryValue}>
						{
							info?.ticketsData?.filter(
								(ticket: Ticket) => ticket.status === "OPEN"
							).length
						}
					</p>
				</div>
				<div>
					<p className={styles.summaryLabel}>In progress</p>
					<p className={styles.summaryValue}>
						{
							info?.ticketsData?.filter(
								(ticket: Ticket) => ticket.status === "IN_PROGRESS"
							).length
						}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Header;
