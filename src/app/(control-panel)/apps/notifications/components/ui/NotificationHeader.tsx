import Button from '@mui/material/Button';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

type NotificationHeaderProps = {
	onSubmit: () => void;
};

/**
 * The notification header.
 */
function NotificationHeader(props: NotificationHeaderProps) {
	const { onSubmit } = props;

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<Button
						component={NavLinkAdapter}
						to="/apps/notifications"
						color="secondary"
						startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
					>
						Back
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					>
						<Button
							variant="contained"
							color="secondary"
							onClick={onSubmit}
							startIcon={<FuseSvgIcon>lucide:check</FuseSvgIcon>}
						>
							Save
						</Button>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default NotificationHeader;

