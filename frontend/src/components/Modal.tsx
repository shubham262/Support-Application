/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode, memo, type FC } from "react";
import { Modal } from "antd";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children?: ReactNode;
	width?: string | number | any;
	centered?: boolean;
	maskClosable?: boolean;
	style?: any;
	className?: string;
	zIndex?: number;
	mask?: boolean;
	modalRender?: any;
}

const ModalComponent: FC<ModalProps> = ({
	open,
	onClose,
	centered = false,
	children,
	width,
	maskClosable,
	style = {},
	className = "",
	zIndex = 1000,
	mask,
	modalRender,
}) => {
	return (
		<>
			<Modal
				open={open}
				onCancel={onClose}
				centered={centered}
				width={width}
				maskClosable={maskClosable !== undefined ? maskClosable : true}
				style={{ ...style }}
				className={className || ""}
				zIndex={zIndex}
				footer={null}
				closeIcon={null}
				{...(mask !== undefined ? { mask } : {})}
				{...(modalRender !== undefined ? { modalRender } : {})}
			>
				{children}
			</Modal>
		</>
	);
};

export default memo(ModalComponent);
