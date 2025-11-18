import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import UserListItem from './UserListItem';
import { useFilteredUsers } from '../../../hooks/useFilteredUsers';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * The users list.
 */
function UsersList() {
	const { data: filteredUsers, isLoading } = useFilteredUsers();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!filteredUsers || filteredUsers.length === 0) {
		return (
			<div className="flex h-full flex-1 items-center justify-center">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no users!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex max-h-full w-full flex-auto flex-col"
		>
			<List className="m-0 w-full p-0">
				{filteredUsers.map((user) => (
					<UserListItem
						key={user.id}
						user={user}
					/>
				))}
			</List>
		</motion.div>
	);
}

export default UsersList;

