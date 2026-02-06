import { Request, Response } from "express";
import prisma from "../configs/prisma";
import { TicketPriority, TicketStatus } from "@prisma/client";

const allowedStatus = new Set(Object.values(TicketStatus));
const allowedPriority = new Set(Object.values(TicketPriority));

export const createTicket = async (req: Request, res: Response) => {
	try {
		const {
			title,
			description,
			status = "OPEN",
			priority = "LOW",
		} = req.body ?? {};

		if (!title || title.length < 5) {
			return res.status(400).json({
				message: "Title is required and must be atleast 5 characters long.",
			});
		}

		if (!description || description.length < 20) {
			return res.status(400).json({
				message:
					"Description is required and must be atleast 20 characters long.",
			});
		}

		if (status && !allowedStatus.has(status)) {
			return res.status(400).json({ message: "Invalid status." });
		}
		if (priority && !allowedPriority.has(priority)) {
			return res.status(400).json({ message: "Invalid priority." });
		}

		const ticket = await prisma.ticket.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				status,
				priority,
			},
		});

		return res.status(201).json({ message: "Ticket created.", ticket });
	} catch (error) {
		return res.status(500).json({ message: "Failed to create ticket." });
	}
};

export const fetchTickets = async (req: Request, res: Response) => {
	try {
		const {
			status = "",
			priority = "",
			search = "",
			page = "1",
			limit = "10",
			sortBy = "newest",
		} = req.query ?? {};

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);

		if (isNaN(pageNum) || pageNum < 1) {
			return res.status(400).json({ message: "Invalid page number." });
		}

		if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
			return res
				.status(400)
				.json({ message: "Invalid limit. Must be between 1 and 100." });
		}

		if (status && !allowedStatus.has(status as TicketStatus)) {
			return res.status(400).json({ message: "Invalid status." });
		}

		if (priority && !allowedPriority.has(priority as TicketPriority)) {
			return res.status(400).json({ message: "Invalid priority." });
		}

		if (sortBy && sortBy !== "newest" && sortBy !== "oldest") {
			return res
				.status(400)
				.json({ message: "Invalid sortBy. Use 'newest' or 'oldest'." });
		}

		const where: any = {};

		if (status) {
			where.status = status as TicketStatus;
		}

		if (priority) {
			where.priority = priority as TicketPriority;
		}

		if (search) {
			where.OR = [
				{ title: { contains: search as string, mode: "insensitive" } },
				{ description: { contains: search as string, mode: "insensitive" } },
			];
		}

		const skip = (pageNum - 1) * limitNum;

		const orderBy =
			sortBy === "oldest"
				? { createdAt: "asc" as const }
				: { createdAt: "desc" as const };

		const totalCount = await prisma.ticket.count({ where });

		const tickets = await prisma.ticket.findMany({
			where,
			orderBy,
			skip,
			take: limitNum,
		});

		const totalPages = Math.ceil(totalCount / limitNum);
		const hasNext = pageNum < totalPages;
		const hasPrevious = pageNum > 1;

		return res.status(200).json({
			tickets,
			pagination: {
				currentPage: pageNum,
				limit: limitNum,
				totalCount,
				totalPages,
				hasNext,
				hasPrevious,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch tickets." });
	}
};

export const fetchTicketDetails = async (req: Request, res: Response) => {
	try {
		let { id = "" } = req.params;
		id = id?.toString();
		if (!id) {
			return res.status(400).json({ message: "Ticket id is required." });
		}
		const ticket = await prisma.ticket.findUnique({
			where: { id },
			include: { comments: true },
		});
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found." });
		}
		return res.status(200).json({ ticket });
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch ticket." });
	}
};

export const updateTicket = async (req: Request, res: Response) => {
	try {
		let { id = "" } = req.params;
		id = id?.toString();
		if (!id) {
			return res.status(400).json({ message: "Ticket id is required." });
		}
		let { title, description, status, priority } = req.body ?? {};
		title = title?.trim();
		description = description?.trim();
		const updateData: {
			title?: string;
			description?: string;
			status?: TicketStatus;
			priority?: TicketPriority;
		} = {};
		if (title !== undefined) {
			if (!title || title.length < 5) {
				return res.status(400).json({
					message: "Title is required and must be atleast 5 characters long.",
				});
			}
			updateData.title = title;
		}
		if (description !== undefined) {
			if (description && description?.length < 5) {
				return res.status(400).json({
					message:
						"Description must be a string and of atleast 20 characters long",
				});
			}
			updateData.description = description;
		}
		if (status && !allowedStatus.has(status)) {
			return res.status(400).json({ message: "Invalid status." });
		}
		if (priority && !allowedPriority.has(priority)) {
			return res.status(400).json({ message: "Invalid priority." });
		}

		if (status) updateData.status = status;
		if (priority) updateData.priority = priority;

		const existing = await prisma.ticket.findUnique({ where: { id } });
		if (!existing) {
			return res.status(404).json({ message: "Ticket not found." });
		}
		const ticket = await prisma.ticket.update({
			where: { id },
			data: updateData,
		});
		return res.status(200).json({ message: "Ticket updated.", ticket });
	} catch (error) {
		return res.status(500).json({ message: "Failed to update ticket." });
	}
};

export const deleteTicket = async (req: Request, res: Response) => {
	try {
		let { id = "" } = req.params;
		id = id?.toString();
		if (!id) {
			return res.status(400).json({ message: "Ticket id is required." });
		}

		const existing = await prisma.ticket.findUnique({ where: { id } });
		if (!existing) {
			return res.status(404).json({ message: "Ticket not found." });
		}
		await prisma.ticket.delete({ where: { id } });
		return res.status(200).json({ message: "Ticket deleted." });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete ticket." });
	}
};

export const seedSampleData = async (req: Request, res: Response) => {
	try {
		const ticketsToCreate = 10;
		const commentPerTicket = 2;
		const createdTickets = [];

		for (let i = 1; i <= ticketsToCreate; i++) {
			const ticket = await prisma.ticket.create({
				data: {
					title: `Sample Ticket ${i}`,
					description: `This is a sample description for ticket ${i}. It has enough detail to pass validation.`,
					status: "OPEN",
					priority: "MEDIUM",
					comments: {
						create: Array.from({ length: commentPerTicket }).map((_, idx) => ({
							authorName: `User ${idx + 1}`,
							message: `Sample comment ${idx + 1} for ticket ${i}.`,
						})),
					},
				},
				include: { comments: true },
			});
			createdTickets.push(ticket);
		}

		return res.status(201).json({
			message: "Sample data seeded.",
			count: createdTickets.length,
			tickets: createdTickets,
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to seed sample data." });
	}
};
