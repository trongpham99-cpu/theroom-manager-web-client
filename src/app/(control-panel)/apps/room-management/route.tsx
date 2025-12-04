import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const RoomManagementView = lazy(() => import('./components/views/RoomManagementView'));
const ApartmentView = lazy(() => import('./components/views/ApartmentView'));
const RoomView = lazy(() => import('./components/views/RoomView'));

/**
 * The Room Management app Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/room-management',
	element: (
		<RoomManagementView>
			<Outlet />
		</RoomManagementView>
	),
	children: [
		{
			path: 'apartment/:apartmentId',
			element: <ApartmentView />
		},
		{
			path: 'room/:roomId',
			element: <RoomView />
		}
	]
};

export default Route;

