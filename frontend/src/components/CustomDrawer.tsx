import { type FC, type ReactNode, memo } from "react";

import { Drawer } from "antd";

interface CustomDrawerProps {
	children?: ReactNode;
	onClose: () => void;
	open: boolean;
	width: string | number;
	rootClassName?: string;
	placement: any;
	closable: boolean;
	maskClosable?: boolean;
	mask?: boolean;
	getContainer?: any;
}

const CustomDrawer: FC<CustomDrawerProps> = ({
	children,
	onClose,
	open,
	width,
	placement,
	closable,
	rootClassName = "",
	maskClosable,
	mask,
	getContainer,
}) => {
	return (
		<>
			<Drawer
				placement={placement || "left"}
				closable={closable}
				onClose={onClose}
				open={open}
				key={"Drawer"}
				width={width}
				rootClassName={`drawerClassName ${rootClassName}`}
				maskClosable={maskClosable !== undefined ? maskClosable : true}
				{...(mask !== undefined ? { mask } : {})}
				{...(getContainer !== undefined ? { getContainer } : {})}
			>
				{children}
			</Drawer>
		</>
	);
};

export default memo(CustomDrawer);
