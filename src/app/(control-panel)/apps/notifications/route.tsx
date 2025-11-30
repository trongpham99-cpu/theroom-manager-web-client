import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const NotificationsView = lazy(() => import('./components/views/NotificationsView'));

/**
 * The Notifications app Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/notifications',
	element: <NotificationsView />
};

export default Route;
