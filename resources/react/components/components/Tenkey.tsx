import { createContext, useState } from 'react';

export type TenkeyType = {
	Tenkey: boolean;
	changeTenkey: () => void;
};
const TenkeyContext = createContext<TenkeyType>({
	Tenkey: false,
	changeTenkey: () => {},
});
export function useTenkey(): TenkeyType {
	const [Tenkey, setTenkey] = useState<boolean>(false);

	function changeTenkey(): void {
		setTenkey(!Tenkey);
	}
	return {
		Tenkey,
		changeTenkey,
	};
}

export default TenkeyContext;
