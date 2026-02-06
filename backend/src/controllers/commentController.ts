import { Request, Response } from "express";
import prisma from "../configs/prisma";

const MESSAGE_MIN = 1;
const MESSAGE_MAX = 500;

export const addComment = async (req: Request, res: Response) => {
	try {
		let { ticketId = "" } = req.params;
		ticketId = ticketId?.toString();
		if (!ticketId) {
			return res.status(400).json({ message: "Ticket id is required." });
		}

		let { authorName = "", message = "" } = req.body ?? {};
		authorName = authorName?.toString().trim();
		message = message?.toString().trim();

		if (!authorName) {
			return res
				.status(400)
				.json({ message: "Author name is required." });
		}

		if (!message || message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
			return res.status(400).json({
				message: `Message must be ${MESSAGE_MIN}-${MESSAGE_MAX} characters long.`,
			});
		}

		const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found." });
		}

		const comment = await prisma.comment.create({
			data: {
				ticketId,
				authorName,
				message,
			},
		});

		return res.status(201).json({ message: "Comment added.", comment });
	} catch (error) {
		return res.status(500).json({ message: "Failed to add comment." });
	}
};

export const deleteComment = async (req: Request, res: Response) => {
	try {
		let { id = "" } = req.params;
		id = id?.toString();
		if (!id) {
			return res.status(400).json({ message: "Comment id is required." });
		}

		const existing = await prisma.comment.findUnique({ where: { id } });
		if (!existing) {
			return res.status(404).json({ message: "Comment not found." });
		}

		await prisma.comment.delete({ where: { id } });
		return res.status(200).json({ message: "Comment deleted." });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete comment." });
	}
};
