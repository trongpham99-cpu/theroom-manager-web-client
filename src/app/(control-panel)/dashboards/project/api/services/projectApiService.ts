import { api } from '@/utils/api';
import { ProjectDashboardWidgetType, ProjectType } from '../types';

export const projectApiService = {
	getWidgets: async (): Promise<Record<string, ProjectDashboardWidgetType>> => {
		// Mock disabled - return empty data
		return {};
	},
	getProjects: async (): Promise<ProjectType[]> => {
		// Mock disabled - return empty data
		return [];
	}
};
