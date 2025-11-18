import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { AssignRoomInput, Customer } from '../types';

type ApiResponse = {
	status: string;
	message: string;
	data: Customer;
};

export function useAssignRoom() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async ({ customerId, data }: { customerId: string; data: AssignRoomInput }) => {
			const response = await api.post(`customers/${customerId}/assign-room`, { json: data }).json<ApiResponse>();
			return response.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
			const hasRoom = !!data.room_id;
			const message = hasRoom
				? `Customer ${data.room_id?.code ? `assigned to room ${data.room_id.code}` : 'moved to new room'} successfully!`
				: 'Room assigned successfully!';
			enqueueSnackbar(message, { variant: 'success' });
		},
		onError: (error: any) => {
			const errorMessage = error?.response?.data?.message || error?.message || 'Failed to assign room';
			enqueueSnackbar(errorMessage, { variant: 'error' });
		}
	});
}

