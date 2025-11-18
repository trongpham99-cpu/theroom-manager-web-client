'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import InvoicesHeader from '../ui/InvoicesHeader';
import InvoicesTable from '../ui/InvoicesTable';
import InvoiceView from './InvoiceView';
import CreateInvoiceDialog from '../dialogs/CreateInvoiceDialog';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import { useSendManyInvoices } from '../../api/hooks/useSendManyInvoices';
import { useSnackbar } from 'notistack';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2]
	}
}));

type InvoicesAppProps = {
	children?: React.ReactNode;
};

function InvoicesAppView(props: InvoicesAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
	const sendManyInvoices = useSendManyInvoices();
	const { openDialog } = useFuseDialogContext();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.invoiceId);
	}, [routeParams]);

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	const handleSendManyClick = (invoiceIds: string[]) => {
		if (invoiceIds.length === 0) {
			enqueueSnackbar('Please select at least one invoice', { variant: 'warning' });
			return;
		}

		openDialog({
			id: 'send-many-invoices',
			content: ({ handleClose }) => (
				<>
					<DialogTitle>Send Multiple Invoices?</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Send <strong>{invoiceIds.length} invoice{invoiceIds.length > 1 ? 's' : ''}</strong> via Zalo ZNS?
							<br />
							This action will send all selected invoices.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							color="inherit"
						>
							Cancel
						</Button>
						<Button
							onClick={async () => {
								try {
									await sendManyInvoices.mutateAsync(invoiceIds);
									setSelectedInvoiceIds([]);
									handleClose();
								} catch (error: any) {
									console.error('Error sending invoices:', error);
									handleClose();
								}
							}}
							variant="contained"
							color="primary"
							autoFocus
							disabled={sendManyInvoices.isPending}
						>
							{sendManyInvoices.isPending ? 'Sending...' : `Send ${invoiceIds.length} Invoice${invoiceIds.length > 1 ? 's' : ''}`}
						</Button>
					</DialogActions>
				</>
			)
		});
	};

	return (
		<>
			<Root
				header={
					<InvoicesHeader
						onAddClick={handleAddClick}
						onSendManyClick={handleSendManyClick}
						selectedInvoiceIds={selectedInvoiceIds}
					/>
				}
				content={<InvoicesTable onSelectionChange={setSelectedInvoiceIds} />}
				ref={pageLayout}
				rightSidebarProps={{
					content: (
						<Box className="flex h-full flex-col">
							{children}
						</Box>
					),
					open: rightSidebarOpen,
					onClose: () => navigate('/apps/invoices'),
					width: 800,
					variant: 'temporary'
				}}
				scroll={isMobile ? 'page' : 'content'}
			/>

			<CreateInvoiceDialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
			/>
		</>
	);
}

export default InvoicesAppView;

