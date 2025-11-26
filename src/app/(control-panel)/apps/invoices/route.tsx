import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';
import i18next from 'i18next';
import en from './i18n/en';
import vi from './i18n/vi';

const InvoicesAppView = lazy(() => import('./components/views/InvoicesAppView'));
const InvoiceView = lazy(() => import('./components/views/InvoiceView'));

i18next.addResourceBundle('en', 'invoicesApp', en);
i18next.addResourceBundle('vi', 'invoicesApp', vi);

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

