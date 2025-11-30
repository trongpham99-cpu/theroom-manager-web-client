import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useFilteredUsers } from '../../hooks/useFilteredUsers';
import CreateUserDialog from '../dialogs/CreateUserDialog';

/**
 * The users header.
 */
function UsersHeader() {
	const { searchText, setSearchText } = useSearch();
	const { data: filteredData } = useFilteredUsers();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	return (
		<>
			<div className="w-full px-4 py-4 md:px-6">
				<PageBreadcrumb className="mb-2" />

				<div className="flex items-center gap-1 sm:flex-row md:items-start">
					<div className="flex flex-auto flex-col gap-1">
						<motion.span
							initial={{ x: -20 }}
							animate={{ x: 0, transition: { delay: 0.2 } }}
						>
							<Typography className="text-4xl leading-none font-extrabold tracking-tight">
								Users
							</Typography>
						</motion.span>
						<motion.span
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<Typography
								component={motion.span}
								className="ml-0.5 text-base font-medium"
								color="text.secondary"
							>
								{`${filteredData?.length || 0} users`}
							</Typography>
						</motion.span>
					</div>
					<div className="flex flex-1 items-center justify-end gap-2">
						<Box
							component={motion.div}
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
							className="flex h-9 min-w-40 items-center gap-2 rounded-lg border-1 px-3 sm:w-auto"
						>
							<FuseSvgIcon color="action">lucide:search</FuseSvgIcon>

							<Input
								placeholder="Search users"
								className="flex flex-1"
								disableUnderline
								fullWidth
								value={searchText}
								slotProps={{
									input: {
										'aria-label': 'Search'
									}
								}}
								onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSearchText(ev.target.value)}
							/>
						</Box>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => setOpenCreateDialog(true)}
							startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
						>
							Add
						</Button>
					</div>
				</div>
			</div>

			<CreateUserDialog
				open={openCreateDialog}
				onClose={() => setOpenCreateDialog(false)}
			/>
		</>
	);
}

export default UsersHeader;

