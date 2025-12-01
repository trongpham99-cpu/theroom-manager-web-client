import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const RoomManagementView = lazy(() => import('./components/views/RoomManagementView'));

/**
 * The Room Management app Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/room-management',
	element: <RoomManagementView />
};

export default Route;

