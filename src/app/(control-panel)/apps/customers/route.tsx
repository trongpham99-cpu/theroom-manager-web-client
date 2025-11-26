import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const CustomersAppView = lazy(() => import('./components/views/CustomersAppView'));
const CustomerView = lazy(() => import('./components/views/CustomerView'));

/**
 * The CustomersApp Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/customers',
	element: (
		<CustomersAppView>
			<Outlet />
		</CustomersAppView>
	),
	children: [
		{
			path: ':customerId',
			element: <CustomerView />
		}
	]
};

export default route;

