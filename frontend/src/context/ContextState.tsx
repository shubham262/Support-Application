/* eslint-disable react-refresh/only-export-components */

import { type ReactNode, createContext, memo, useContext } from "react";

import useCombineState from "./combineState";

interface ContextProviderProps {
	children: ReactNode;
}

export const Context = createContext({});

const ContextState = ({ children }: ContextProviderProps) => {
	const combinedState = useCombineState();
	return <Context.Provider value={combinedState}>{children}</Context.Provider>;
};

export default memo(ContextState);

export const useContextState = () => useContext(Context);
