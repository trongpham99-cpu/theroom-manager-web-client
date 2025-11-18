import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useCustomers } from '../../api/hooks/useCustomers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import { useSearch } from '../../hooks/useSearch';

type CustomersHeaderProps = {
	onAddClick: () => void;
};

function CustomersHeader({ onAddClick }: CustomersHeaderProps) {
	const { data } = useCustomers({ page: 1, limit: 1 });
	const { searchText, setSearchText } = useSearch();

	return (
		<div className="w-full px-4 py-4 md:px-6">
			<PageBreadcrumb className="mb-2" />

			<div className="flex items-center gap-1 sm:flex-row md:items-start">
				<div className="flex flex-auto flex-col gap-1">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography className="text-4xl leading-none font-extrabold tracking-tight">
							Customers
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
							{data?.total || 0} customers
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
							placeholder="Search customers"
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
						onClick={onAddClick}
						startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
					>
						Add Customer
					</Button>
				</div>
			</div>
		</div>
	);
}

export default CustomersHeader;

