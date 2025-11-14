import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const UsersAppView = lazy(() => import('./components/views/UsersAppView'));
const UserView = lazy(() => import('./components/views/UserView'));
const UserForm = lazy(() => import('./components/forms/UserForm'));

/**
 * The Users Management Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/users',
	element: (
		<UsersAppView>
			<Outlet />
		</UsersAppView>
	),
	children: [
		{
			path: ':userId',
			element: <UserView />
		},
		{
			path: ':userId/edit',
			element: <UserForm />
		}
		// 'new' route removed - using dialog instead
	]
};

export default route;
