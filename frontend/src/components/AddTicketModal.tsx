import { useCallback, useState, type FC } from "react";
import { Button, Input, message, Select } from "antd";
import Modal from "./Modal";
import styles from "../assets/styles/addTicketModal.module.scss";
import { useContextState } from "../context/ContextState";
interface AddTicketModalProps {
	open: boolean;
	onClose: () => void;
}

const AddTicketModal: FC<AddTicketModalProps> = ({ open, onClose }) => {
	const {
		ticketInfo: { updateTicketState, createTicket },
	}: any = useContextState();

	const [info, setInfo] = useState<{
		title: string;
		description: string;
		status: string;
		priority: string;
		createLoading: boolean;
	}>({
		title: "",
		description: "",
		status: "OPEN",
		priority: "LOW",
		createLoading: false,
	});

	const handleOnChange = useCallback((key: string, val: string) => {
		setInfo((prev) => ({ ...prev, [key]: val }));
	}, []);

	const handleModifiedClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			title: "",
			description: "",
			status: "OPEN",
			priority: "LOW",
		}));
		onClose();
	}, [onClose]);

	const handleAddTicket = useCallback(async () => {
		try {
			if (info?.createLoading) {
				return message.error("We are handling your requests");
			}

			if (!info?.title || info?.title?.length < 5) {
				return message.error(
					"Please enter a valid title of atleast 5 characters"
				);
			}

			const payload = {
				title: info?.title,
				description: info?.description,
				status: info?.status,
				priority: info?.priority,
			};
			setInfo((prev) => ({ ...prev, createLoading: true }));
			const response = await createTicket(payload);
			if (response) {
				updateTicketState({ refetch: true });
				setInfo((prev) => ({ ...prev, createLoading: false }));
				handleModifiedClose();
			} else {
				setInfo((prev) => ({ ...prev, createLoading: false }));
				message.error("Something went wrong");
			}
		} catch (error: any) {
			setInfo((prev) => ({ ...prev, createLoading: false }));

			message.error(error?.message || "Something went wrong,try again");
		}
	}, [
		info?.createLoading,
		handleModifiedClose,
		info?.title,
		info?.description,
		info?.status,
		info?.priority,
		createTicket,
		updateTicketState,
	]);

	return (
		<Modal
			open={open}
			onClose={handleModifiedClose}
			className={styles.modalRoot}
			centered={true}
			width={"fit-content"}
			style={{
				top: 0,
			}}
		>
			<div className={styles.addTicketModalParentContainer}>
				<button
					className={styles.closeIcon}
					onClick={handleModifiedClose}
					type="button"
				>
					×
				</button>

				<div className={styles.modalHeader}>
					<p className={styles.kicker}>New Ticket</p>
					<h2>Create a support ticket</h2>
					<p className={styles.subtitle}>
						Fill in the details below to open a new ticket for the support team.
					</p>
				</div>

				<div className={styles.formGrid}>
					<div className={styles.field}>
						<span className={styles.label}>Title</span>
						<Input
							size="large"
							placeholder="Short, clear summary (5-80 chars)"
							value={info?.title}
							onChange={(event) =>
								handleOnChange("title", event?.target?.value)
							}
						/>
					</div>

					<div className={styles.fieldWide}>
						<span className={styles.label}>Description</span>
						<Input.TextArea
							rows={5}
							placeholder="Provide details, steps to reproduce, or context (20-2000 chars)"
							value={info?.description}
							onChange={(event) =>
								handleOnChange("description", event?.target?.value)
							}
						/>
					</div>

					<div className={styles.field}>
						<span className={styles.label}>Status</span>
						<Select
							size="large"
							defaultValue="OPEN"
							options={[
								{ value: "OPEN", label: "Open" },
								{ value: "IN_PROGRESS", label: "In progress" },
								{ value: "RESOLVED", label: "Resolved" },
							]}
							value={info?.status}
							onChange={(val) => handleOnChange("status", val)}
						/>
					</div>

					<div className={styles.field}>
						<span className={styles.label}>Priority</span>
						<Select
							size="large"
							defaultValue="LOW"
							options={[
								{ value: "LOW", label: "Low" },
								{ value: "MEDIUM", label: "Medium" },
								{ value: "HIGH", label: "High" },
							]}
							value={info?.priority}
							onChange={(val) => handleOnChange("priority", val)}
						/>
					</div>
				</div>

				<div className={styles.footer}>
					<Button className={styles.secondaryButton} onClick={onClose}>
						Close
					</Button>
					<Button
						type="primary"
						className={styles.primaryButton}
						onClick={handleAddTicket}
					>
						{info?.createLoading ? "Creating ..." : "Create ticket"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AddTicketModal;
