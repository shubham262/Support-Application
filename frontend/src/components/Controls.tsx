import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import styles from "../assets/styles/controls.module.scss";
import AddTicketModal from "./AddTicketModal";
import { useContextState } from "../context/ContextState";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";
const statusOptions: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];
const priorityOptions: TicketPriority[] = ["LOW", "MEDIUM", "HIGH"];
const Controls = () => {
	const {
		ticketInfo: {
			fetchTickets,
			refetch,
			updateTicketState,
			ticketsPagination,
			fetchMore,
		},
	}: any = useContextState();
	const fetchTimeoutRef = useRef<any>(null);
	const isFirstRunRef = useRef(true);
	const [info, setInfo] = useState<{
		search: string;
		statusFilter: TicketStatus | "ALL";
		priorityFilter: TicketPriority | "ALL";
		sortOrder: "newest" | "oldest";
		addTicketModal: boolean;
		currentPage: number;
		limit: number;
	}>({
		search: "",
		statusFilter: "ALL",
		priorityFilter: "ALL",
		sortOrder: "newest",
		addTicketModal: false,
		currentPage: 1,
		limit: 15,
	});

	useEffect(() => {
		getTickets();
	}, []);

	useEffect(() => {
		if (ticketsPagination) {
			setInfo((prev) => ({
				...prev,
				currentPage: ticketsPagination?.currentPage || 1,
			}));
		}
	}, [ticketsPagination]);

	useEffect(() => {
		if (fetchMore) {
			isFirstRunRef.current = true;
			getTickets(true);
		}
	}, [fetchMore]);

	useEffect(() => {
		if (isFirstRunRef.current) {
			isFirstRunRef.current = false;
			return;
		}
		debouncedfetch();
	}, [
		info?.search,
		info?.statusFilter,
		info?.priorityFilter,
		info?.sortOrder,
		info?.currentPage,
		info?.limit,
	]);

	useEffect(() => {
		if (refetch) {
			getTickets();
			updateTicketState({ refetch: false });
		}
	}, [refetch]);

	const toggleModal = useCallback((val: boolean) => {
		setInfo((prev) => ({ ...prev, addTicketModal: val }));
	}, []);

	const getTickets = useCallback(
		(fetchMore = false) => {
			let paramString = `?page=${
				fetchMore ? info?.currentPage + 1 : info?.currentPage
			}&limit=${info?.limit}`;

			if (info?.search && info?.search?.length) {
				paramString += `&search=${info?.search}`;
			}
			if (info?.statusFilter !== "ALL") {
				paramString += `&status=${info?.statusFilter}`;
			}
			if (info?.priorityFilter !== "ALL") {
				paramString += `&priority=${info?.priorityFilter}`;
			}
			paramString += `&sortBy=${info?.sortOrder}`;
			fetchTickets(paramString, fetchMore);
		},
		[
			info?.currentPage,
			info?.limit,
			info?.priorityFilter,
			info?.search,
			info?.sortOrder,
			info?.statusFilter,
		]
	);

	const debouncedfetch = useCallback(() => {
		if (fetchTimeoutRef.current) {
			clearTimeout(fetchTimeoutRef.current);
		}

		fetchTimeoutRef.current = setTimeout(() => {
			getTickets();
		}, 600);
	}, [getTickets]);

	return (
		<div className={styles.controls}>
			<div className={styles.controlsRow}>
				<div className={styles.searchField}>
					<span className={styles.searchLabel}>Search</span>
					<Input
						size="large"
						allowClear
						placeholder="Search by title or description"
						value={info?.search}
						onChange={(event) =>
							setInfo((prev) => ({
								...prev,
								search: event.target.value,
								currentPage: 1,
							}))
						}
					/>
				</div>

				<div className={styles.filters}>
					<div className={styles.filterField}>
						<span>Status</span>
						<Select
							size="large"
							value={info?.statusFilter}
							onChange={(value) =>
								setInfo((prev) => ({
									...prev,
									statusFilter: value as TicketStatus | "ALL",
									currentPage: 1,
								}))
							}
							options={[
								{ value: "ALL", label: "All" },
								...statusOptions.map((status) => ({
									value: status,
									label: status.replace("_", " "),
								})),
							]}
						/>
					</div>

					<div className={styles.filterField}>
						<span>Priority</span>
						<Select
							size="large"
							value={info?.priorityFilter}
							onChange={(value) =>
								setInfo((prev) => ({
									...prev,
									priorityFilter: value as TicketPriority | "ALL",
									currentPage: 1,
								}))
							}
							options={[
								{ value: "ALL", label: "All" },
								...priorityOptions.map((priority) => ({
									value: priority,
									label: priority,
								})),
							]}
						/>
					</div>

					<div className={styles.filterField}>
						<span>Sort by</span>
						<Select
							size="large"
							value={info?.sortOrder}
							onChange={(value) =>
								setInfo((prev) => ({
									...prev,
									sortOrder: value as "newest" | "oldest",
								}))
							}
							options={[
								{ value: "newest", label: "Created date (newest)" },
								{ value: "oldest", label: "Created date (oldest)" },
							]}
						/>
					</div>
				</div>

				<Button
					className={styles.addButton}
					type="primary"
					size="large"
					onClick={() => toggleModal(true)}
				>
					Add ticket
				</Button>
			</div>
			<AddTicketModal
				open={info?.addTicketModal}
				onClose={() => toggleModal(false)}
			/>
		</div>
	);
};

export default Controls;
