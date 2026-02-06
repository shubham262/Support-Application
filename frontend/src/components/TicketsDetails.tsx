import { useCallback, useEffect, useState, type FC } from "react";
import { Button, Divider, Input, message, Select, Skeleton } from "antd";
import CustomDrawer from "./CustomDrawer";
import type { Ticket, TicketComment } from "../context/ticket/state";
import styles from "../assets/styles/ticketDetails.module.scss";
import { useContextState } from "../context/ContextState";
import moment from "moment";
interface TicketsDetailsProps {
	open: boolean;
	onClose: (e: any) => void;
	ticketData?: Ticket;
}

const TicketsDetails: FC<TicketsDetailsProps> = ({
	open,
	onClose,
	ticketData,
}) => {
	const {
		ticketInfo: {
			updateTicketState,
			updateTicket,
			fetchTicketDetails,
			deleteTicket,
			deleteComment,
			addComment,
		},
	}: any = useContextState();

	const [info, setInfo] = useState<{
		title: string;
		description: string;
		status: string;
		priority: string;
		updateLoading: boolean;
		commentsLoading: boolean;
		ticketDetails: any;
		authorName: string;
		message: string;
		addCommentLoading: boolean;
	}>({
		title: "",
		description: "",
		status: "OPEN",
		priority: "LOW",
		updateLoading: false,
		commentsLoading: true,
		ticketDetails: {
			comments: [],
		},
		authorName: "",
		message: "",
		addCommentLoading: false,
	});

	useEffect(() => {
		if (ticketData && open) {
			setInfo((prev) => ({
				...prev,
				title: ticketData?.title || "",
				description: ticketData?.description || "",
				status: ticketData?.status || "OPEN",
				priority: ticketData?.priority || "LOW",
			}));
			fetchTicketSpecificDetails();
		}
	}, [ticketData, open]);

	const handleOnChange = useCallback((key: string, val: string) => {
		setInfo((prev) => ({ ...prev, [key]: val }));
	}, []);

	const handleDeleteTicket = useCallback(async () => {
		try {
			const response = await deleteTicket(ticketData?.id);
			if (response) {
				updateTicketState({ refetch: true });
				onClose(null);
			} else {
				message.error("Something went wrong,try again");
			}
		} catch (error: any) {
			message.error(error?.message || "Something went wrong,try again");
		}
	}, []);

	const handleDeleteComment = useCallback(async (commnetId: string) => {
		try {
			const response = await deleteComment(commnetId);
			if (response) {
				updateTicketState({ refetch: true });
			} else {
				message.error("Something went wrong,try again");
			}
		} catch (error: any) {
			message.error(error?.message || "Something went wrong,try again");
		}
	}, []);

	const fetchTicketSpecificDetails = useCallback(async () => {
		try {
			const response = await fetchTicketDetails(ticketData?.id);

			if (response?.[0]) {
				setInfo((prev) => ({
					...prev,
					ticketDetails: response?.[1],
					commentsLoading: false,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					commentsLoading: false,
				}));
			}
		} catch (error: any) {
			setInfo((prev) => ({
				...prev,
				commentsLoading: false,
			}));
			message.error(error?.message || "Something went wrong,try again");
		}
	}, [ticketData, fetchTicketDetails]);

	const handleAddComment = useCallback(async () => {
		try {
			if (info?.addCommentLoading) {
				return message.error("We are already handling your requests");
			}

			if (!info?.authorName || !info?.message) {
				return message.error("Please add valid message and authorName");
			}

			const payload = {
				authorName: info?.authorName?.trim() || "",
				message: info?.message?.trim() || "",
			};
			setInfo((prev) => ({ ...prev, addCommentLoading: true }));
			await addComment(ticketData?.id, payload);
			await fetchTicketSpecificDetails();
			setInfo((prev) => ({
				...prev,
				addCommentLoading: false,
				authorName: "",
				message: "",
			}));
		} catch (error: any) {
			setInfo((prev) => ({
				...prev,
				addCommentLoading: false,
			}));
			message.error(error?.message || "Something went wrong,try again");
		}
	}, [info?.authorName, fetchTicketSpecificDetails, info?.message, ticketData]);

	const updateTicketFunc = useCallback(async () => {
		try {
			const payload: any = {};
			if (info?.title !== ticketData?.title) {
				payload.title = info?.title;
			}
			if (info?.description !== ticketData?.description) {
				payload.description = info?.description;
			}
			if (info?.status !== ticketData?.status) {
				payload.status = info?.status;
			}
			if (info?.priority !== ticketData?.priority) {
				payload.priority = info?.priority;
			}

			if (!Object.keys(payload)?.length) {
				return message.error("No changes made");
			}
			if (!info?.title || info?.title?.length < 5) {
				return message.error(
					"Please enter a valid title of atleast 5 characters"
				);
			}
			setInfo((prev) => ({ ...prev, updateLoading: true }));
			await updateTicket(ticketData?.id, payload);
			updateTicketState({ refetch: true });
			setInfo((prev) => ({ ...prev, updateLoading: false }));
		} catch (error: any) {
			setInfo((prev) => ({ ...prev, updateLoading: false }));

			message.error(error?.message || "Something went wrong,try again");
		}
	}, [
		info?.updateLoading,
		ticketData,
		info?.title,
		info?.description,
		info?.status,
		info?.priority,
	]);

	const clear = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			addCommentLoading: false,
			authorName: "",
			message: "",
		}));
	}, []);

	const discardChanges = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			title: ticketData?.title || "",
			description: ticketData?.description || "",
			status: ticketData?.status || "OPEN",
			priority: ticketData?.priority || "LOW",
		}));
	}, [ticketData]);

	return (
		<CustomDrawer
			placement={"right"}
			onClose={(e) => onClose(e)}
			open={open}
			width={600}
			closable={false}
			maskClosable={true}
			rootClassName={styles.drawerRoot}
		>
			<div className={styles.drawerParentContainer}>
				<button
					type="button"
					className={styles.closeIcon}
					onClick={(e) => onClose(e)}
				>
					×
				</button>

				<div className={styles.header}>
					<p className={styles.kicker}>Ticket Details</p>
					<h2>{ticketData?.title || "Untitled ticket"}</h2>
					<p className={styles.subtitle}>
						Review, update, and track this ticket from one place.
					</p>
					<div className={styles.metaRow}>
						<span>
							Created{" "}
							{ticketData?.createdAt
								? moment(ticketData?.createdAt)?.format("MMM DD,YYYY")
								: "—"}
						</span>
						<span>
							Updated{" "}
							{ticketData?.updatedAt
								? moment(ticketData?.updatedAt)?.format("MMM DD,YYYY")
								: "—"}
						</span>
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Details</h3>
						<Button
							danger
							className={styles.deleteTicketButton}
							onClick={handleDeleteTicket}
						>
							Delete ticket
						</Button>
					</div>
					<div className={styles.formGrid}>
						<div className={styles.field}>
							<span className={styles.label}>Title</span>
							<Input
								size="large"
								defaultValue={ticketData?.title}
								placeholder="Enter a ticket title"
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
								defaultValue={ticketData?.description}
								placeholder="Describe the issue in detail"
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
								defaultValue={ticketData?.status || "OPEN"}
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
								defaultValue={ticketData?.priority || "MEDIUM"}
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
					<div className={styles.actionsRow}>
						<Button className={styles.secondaryButton} onClick={discardChanges}>
							Discard changes
						</Button>
						<Button
							type="primary"
							className={styles.primaryButton}
							onClick={updateTicketFunc}
						>
							{info?.updateLoading ? "Saving ..." : "Save updates"}
						</Button>
					</div>
				</div>

				<Divider className={styles.divider} />

				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Comments</h3>
						<span className={styles.countPill}>
							{info?.ticketDetails?.comments?.length || 0} total
						</span>
					</div>

					<div className={styles.commentList}>
						{info?.commentsLoading && (
							<div className={styles.commentSkeletons}>
								<Skeleton active title={false} paragraph={{ rows: 2 }} />
								<Skeleton active title={false} paragraph={{ rows: 2 }} />
								<Skeleton active title={false} paragraph={{ rows: 2 }} />
							</div>
						)}
						{!info?.commentsLoading &&
							info?.ticketDetails?.comments?.length === 0 && (
								<p className={styles.emptyState}>
									No comments yet. Start the conversation below.
								</p>
							)}
						{!info?.commentsLoading &&
							info?.ticketDetails?.comments?.map((comment: TicketComment) => (
								<div key={comment.id} className={styles.commentCard}>
									<div className={styles.commentHeader}>
										<div>
											<p className={styles.commentAuthor}>
												{comment.authorName}
											</p>
											<p className={styles.commentDate}>
												{moment(comment?.createdAt)?.format("MMM DD,YYYY")}
											</p>
										</div>
										<Button
											danger
											type="text"
											size="small"
											onClick={() => handleDeleteComment(comment?.id)}
										>
											Delete
										</Button>
									</div>
									<p className={styles.commentMessage}>{comment.message}</p>
								</div>
							))}
					</div>

					<div className={styles.newComment}>
						<h4>Add a comment</h4>
						<div className={styles.formGrid}>
							<div className={styles.field}>
								<span className={styles.label}>Author</span>
								<Input
									size="large"
									placeholder="Your name"
									value={info?.authorName}
									onChange={(e) =>
										handleOnChange("authorName", e?.target?.value)
									}
								/>
							</div>
							<div className={styles.fieldWide}>
								<span className={styles.label}>Message</span>
								<Input.TextArea
									rows={4}
									placeholder="Share an update or ask a question (1-500 chars)"
									value={info?.message}
									onChange={(e) => handleOnChange("message", e?.target?.value)}
								/>
							</div>
						</div>
						<div className={styles.actionsRow}>
							<Button className={styles.secondaryButton} onClick={clear}>
								Clear
							</Button>
							<Button
								type="primary"
								className={styles.primaryButton}
								onClick={handleAddComment}
							>
								{info?.addCommentLoading ? "Adding Comment ..." : "Add comment"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</CustomDrawer>
	);
};

export default TicketsDetails;
