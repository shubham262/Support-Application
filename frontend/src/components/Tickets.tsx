import { useCallback, useMemo, useState, type FC } from "react";
import { Skeleton } from "antd";
import styles from "../assets/styles/tickets.module.scss";
import type { Ticket } from "../context/ticket/state";
import TicketsDetails from "./TicketsDetails";

interface TicketProps {
	ticket: Ticket;
}
const Tickets: FC<TicketProps> = ({ ticket }) => {
	const [info, setInfo] = useState<{
		drawer: boolean;
	}>({
		drawer: false,
	});

	const toggleDrawer = useCallback((e: any, val: boolean) => {
		if (e) {
			e?.stopPropagation();
		}

		setInfo((prev) => ({ ...prev, drawer: val }));
	}, []);

	const formatter = useMemo(
		() =>
			new Intl.DateTimeFormat("en-US", {
				month: "short",
				day: "2-digit",
				year: "numeric",
			}),
		[]
	);

	return (
		<div
			key={ticket.id}
			className={styles.card}
			onClick={(e) => {
				toggleDrawer(e, true);
			}}
		>
			<header className={styles.cardHeader}>
				<h2 className={styles.cardTitle}>{ticket.title}</h2>
				<div className={styles.badges}>
					<span
						className={`${styles.badge} ${styles[`status${ticket.status}`]}`}
					>
						{ticket.status.replace("_", " ")}
					</span>
					<span
						className={`${styles.badge} ${
							styles[`priority${ticket.priority}`]
						}`}
					>
						{ticket.priority}
					</span>
				</div>
			</header>
			<p className={styles.cardDescription}>{ticket.description}</p>
			<footer className={styles.cardFooter}>
				<span>Created {formatter.format(new Date(ticket.createdAt))}</span>
				<span className={styles.updatedAt}>
					Updated {formatter.format(new Date(ticket.updatedAt))}
				</span>
			</footer>

			<TicketsDetails
				open={info?.drawer}
				onClose={(e) => {
					toggleDrawer(e, false);
				}}
				ticketData={ticket}
			/>
		</div>
	);
};

export default Tickets;

export const TicketSkeleton: FC = () => (
	<div className={styles.card}>
		<div className={styles.skeletonHeader}>
			<Skeleton active paragraph={false} title={{ width: "70%" }} />
			<div className={styles.skeletonBadges}>
				<Skeleton.Button active size="small" />
				<Skeleton.Button active size="small" />
			</div>
		</div>
		<Skeleton active title={false} paragraph={{ rows: 3 }} />
		<div className={styles.skeletonFooter}>
			<Skeleton.Input active size="small" style={{ width: 120 }} />
			<Skeleton.Input active size="small" style={{ width: 120 }} />
		</div>
	</div>
);
