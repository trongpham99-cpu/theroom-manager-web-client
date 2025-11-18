import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import useNavigate from '@fuse/hooks/useNavigate';
import api from 'src/utils/api';
import { NotificationCreateInput, Notification } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Notification;
};

export function useCreateNotification() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (data: NotificationCreateInput) => {
			const response = await api.post('notifications/send', { json: data }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			enqueueSnackbar('Notification created successfully (Zalo integration pending)', {
				variant: 'success'
			});
			navigate('/apps/notifications');
		},
		onError: () => {
			enqueueSnackbar('Failed to create notification', { variant: 'error' });
		}
	});
}
