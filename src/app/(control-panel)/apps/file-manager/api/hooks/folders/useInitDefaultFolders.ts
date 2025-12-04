import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { FolderItem } from '../../types';

export const useInitDefaultFolders = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (): Promise<FolderItem[]> => {
			return api.post('file-manager/folders/init').json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['file-manager'] });
		}
	});
};
