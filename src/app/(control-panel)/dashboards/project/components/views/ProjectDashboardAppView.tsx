'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useState } from 'react';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { Tabs, Tab } from '@mui/material';
import ProjectDashboardAppHeader from '../ui/ProjectDashboardAppHeader';
import HomeTab from '../ui/tabs/home/HomeTab';
import TeamTab from '../ui/tabs/team/TeamTab';
import BudgetTab from '../ui/tabs/budget/BudgetTab';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';
import ProjectSelector from '../ui/ProjectSelector';

/**
 * The ProjectDashboardApp page.
 */
function ProjectDashboardAppView() {
	const { isLoading } = useGetWidgets();

	const [tabValue, setTabValue] = useState('general');

	function handleTabChange(event: React.SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			header={<ProjectDashboardAppHeader />}
			content={
				<div className="w-full pt-4 sm:pt-6">
					<div className="flex w-full flex-col justify-between gap-2 px-4 sm:flex-row sm:items-center md:px-8">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							aria-label="Project overview tabs"
						>
							<Tab
								value="general"
								label="Chung"
							/>
							<Tab
								value="electric"
								label="Điện"
							/>
							<Tab
								value="water"
								label="Nước"
							/>
							<Tab
								value="others"
								label="Dịch vụ khác"
							/>
						</Tabs>

						<ProjectSelector />
					</div>
					{tabValue === 'general' && <HomeTab />}
					{tabValue === 'electric' && <BudgetTab />}
					{tabValue === 'water' && <TeamTab />}
					{tabValue === 'others' && <BudgetTab />}
				</div>
			}
		/>
	);
}

export default ProjectDashboardAppView;
