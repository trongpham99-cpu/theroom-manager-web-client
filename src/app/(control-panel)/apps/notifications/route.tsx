import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const NotificationsView = lazy(() => import('./components/views/NotificationsView'));
const NotificationView = lazy(() => import('./components/views/NotificationView'));

/**
 * The Notifications app Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/notifications',
	children: [
		{
			path: '',
			element: <NotificationsView />
		},
		{
			path: 'new',
			element: <NotificationView />
		}
	]
};

export default Route;
