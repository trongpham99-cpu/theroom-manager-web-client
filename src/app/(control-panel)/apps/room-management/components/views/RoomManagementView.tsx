'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { useState, SyntheticEvent } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n';
import roomManagementI18n from '../../i18n';
import ApartmentsTable from '../ui/ApartmentsTable';
import RoomsTable from '../ui/RoomsTable';
import CreateApartmentDialog from '../dialogs/CreateApartmentDialog';
import CreateRoomDialog from '../dialogs/CreateRoomDialog';

i18n.addResourceBundle('en', 'roomManagementApp', roomManagementI18n.en);
i18n.addResourceBundle('vi', 'roomManagementApp', roomManagementI18n.vi);

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The Room Management page.
 */
function RoomManagementView() {
	const { t } = useTranslation('roomManagementApp');
	const [selectedTab, setSelectedTab] = useState('apartments');
	const [openApartmentDialog, setOpenApartmentDialog] = useState(false);
	const [openRoomDialog, setOpenRoomDialog] = useState(false);

	function handleTabChange(event: SyntheticEvent, value: string) {
		setSelectedTab(value);
	}

	const handleAddClick = () => {
		console.log('🔥 Add button clicked! Tab:', selectedTab);
		console.log('Current states:', { openApartmentDialog, openRoomDialog });
		
		if (selectedTab === 'apartments') {
			console.log('✅ Setting openApartmentDialog to TRUE');
			setOpenApartmentDialog(true);
		} else {
			console.log('✅ Setting openRoomDialog to TRUE');
			setOpenRoomDialog(true);
		}
	};

	console.log('🎬 RoomManagementView render - Dialog states:', { openApartmentDialog, openRoomDialog });

	return (
		<>
			<Root
				header={
					<div className="flex flex-auto flex-col py-4">
						<PageBreadcrumb className="mb-2" />
						<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
							<div className="flex flex-auto items-center gap-2">
								<motion.span
									initial={{ x: -20 }}
									animate={{
										x: 0,
										transition: { delay: 0.2 }
									}}
								>
									<Typography className="flex text-4xl leading-none font-extrabold tracking-tight">
										{t('APP_TITLE')}
									</Typography>
								</motion.span>
							</div>
							<div className="flex items-center gap-2">
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
								>
								<Button
									variant="contained"
									color="secondary"
									startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
									onClick={handleAddClick}
								>
									{selectedTab === 'apartments' ? t('ADD_APARTMENT') : t('ADD_ROOM')}
								</Button>
								</motion.div>
							</div>
						</div>

					<div className="mt-4 flex w-full overflow-x-auto">
						<Tabs
							value={selectedTab}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="inherit"
							variant="scrollable"
							scrollButtons={false}
							className="min-h-10"
						>
							<Tab
								className="min-h-10 text-base"
								label={t('APARTMENTS')}
								value="apartments"
							/>
							<Tab
								className="min-h-10 text-base"
								label={t('ROOMS')}
								value="rooms"
							/>
							</Tabs>
						</div>
					</div>
				}
				content={
					<div className="w-full">
						{selectedTab === 'apartments' && <ApartmentsTable />}
						{selectedTab === 'rooms' && <RoomsTable />}
					</div>
				}
			/>
			
			<CreateApartmentDialog
				open={openApartmentDialog}
				onClose={() => {
					console.log('🚪 Closing Apartment Dialog');
					setOpenApartmentDialog(false);
				}}
			/>

			<CreateRoomDialog
				open={openRoomDialog}
				onClose={() => {
					console.log('🚪 Closing Room Dialog');
					setOpenRoomDialog(false);
				}}
			/>
		</>
	);
}

export default RoomManagementView;
