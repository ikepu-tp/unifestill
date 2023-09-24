export type ProjectStoreResource = {
	name: string;
	note: string | null;
};
export type ProjectResource = ProjectStoreResource & {
	projectId: string;
};
export type ProjectMemberStoreResource = {
	name: string;
	note: string | null;
};
export type ProjectMemberResource = ProjectMemberStoreResource & {
	memberId: string;
};
export type ProjectPaymentStoreResource = {
	name: string;
	note: string | null;
};
export type ProjectPaymentResource = ProjectMemberStoreResource & {
	paymentId: string;
};
export type ProjectCategoryStoreResource = {
	name: string;
	note: string | null;
};
export type ProjectCategoryResource = ProjectMemberStoreResource & {
	categoryId: string;
};
export type ProjectItemStoreResource = {
	category_id: string;
	parent_id: string;
	name: string;
	note: string | null;
	price: 100;
};
export type ProjectItemResource = {
	itemId: string;
	category: ProjectCategoryResource;
	parent_id: string;
	name: string;
	note: string | null;
	price: number;
};

export type AccountStoreResource = {
	member_id: string;
	price: number;
	payments: {
		payment_id: string;
		price: number;
	}[];
	items: {
		item_id: string;
		price: number;
		quantity: number;
		children: [];
	}[];
};
export type AccountResource = {
	accountId: string;
	member: ProjectMemberResource;
	price: number;
	payments: {
		accountPaymentId: string;
		payment: ProjectPaymentResource;
		price: number;
	}[];
	items: {
		accountItemId: string;
		item: ProjectItemResource;
		price: number;
		quantity: number;
		children: [];
	}[];
};

export type CheckStoreResource = {
	member_id: string;
	bill_10: number;
	bill_5: number;
	bill_2: number;
	bill_1: number;
	coin_500: number;
	coin_100: number;
	coin_50: number;
	coin_10: number;
	coin_5: number;
	coin_1: number;
};

export type CheckResource = {
	checkId: string;
	member: ProjectMemberResource;
	bill_10: number;
	bill_5: number;
	bill_2: number;
	bill_1: number;
	coin_500: number;
	coin_100: number;
	coin_50: number;
	coin_10: number;
	coin_5: number;
	coin_1: number;
};

export type ReportSaleResource = {
	count: number;
	price: number;
};
export type ReportMemberSaleResource = ReportSaleResource & {
	member: ProjectMemberResource;
};
export type ReportPaymentSaleResource = ReportSaleResource & {
	payment: ProjectPaymentResource;
};
export type ReportCategorySaleResource = ReportSaleResource & {
	category: ProjectCategoryResource;
};
export type ReportItemSaleResource = ReportSaleResource & {
	item: ProjectItemResource;
};
export type ReportResource = {
	from_date: string;
	to_date: string;
	account_count: number;
	sum_sales: number;
	member_sales?: ReportMemberSaleResource[];
};