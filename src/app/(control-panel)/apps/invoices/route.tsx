import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const InvoicesAppView = lazy(() => import('./components/views/InvoicesAppView'));
const InvoiceView = lazy(() => import('./components/views/InvoiceView'));

/**
 * The InvoicesApp Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/invoices',
	element: (
		<InvoicesAppView>
			<Outlet />
		</InvoicesAppView>
	),
	children: [
		{
			path: ':invoiceId',
			element: <InvoiceView />
		}
	]
};

export default route;

