import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FolderItem } from '../../types';

export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation<FolderItem, Error, { path: string; name: string; description?: string }>({
		mutationFn: ({ path, name, description }) => fileManagerApi.createFolder(path, name, description),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['file-manager'] });
		}
	});
};
