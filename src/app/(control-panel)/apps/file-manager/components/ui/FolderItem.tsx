import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import ItemIcon from './ItemIcon';
import { FileManagerItem } from '../../api/types';
import { useFileManagerAppContext } from '../../contexts/FileManagerAppContext/useFileManagerAppContext';
import { useDeleteItems } from '../../api/hooks/items/useDeleteItems';

type FolderItemProps = {
	item: FileManagerItem;
};

/**
 * The folder item.
 */
function FolderItem(props: FolderItemProps) {
	const { item } = props;
	const { setSelectedItemId } = useFileManagerAppContext();
	const deleteItems = useDeleteItems();

	if (!item) {
		return null;
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (window.confirm(`Bạn có chắc muốn xóa folder "${item.name}"?`)) {
			deleteItems.mutate([item.id]);
		}
	};

	return (
		<Box className="relative h-32 w-32 rounded-xl border-1 p-2 shadow-xs">
			<div className="absolute top-0 right-0 z-20 m-1.5 flex gap-0.5">
				<IconButton
					className="h-4 min-h-4 w-4"
					onClick={handleDelete}
				>
					<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
				</IconButton>
				<IconButton
					className="h-4 min-h-4 w-4"
					onClick={() => setSelectedItemId(item.id)}
				>
					<FuseSvgIcon>lucide:info</FuseSvgIcon>
				</IconButton>
			</div>
			<NavLinkAdapter
				className="flex h-full w-full flex-col items-center justify-center gap-0.5"
				to={`/apps/file-manager/${item.id}`}
				role="button"
			>
				<ItemIcon type={item.type} />
				<div className="flex shrink flex-col items-center w-full px-1">
					<Typography className="text-sm text-center font-medium w-full break-words line-clamp-2">
						{item.name}
					</Typography>
					{item.contents && (
						<Typography
							className="text-xs font-medium truncate"
							color="text.secondary"
						>
							{item.contents}
						</Typography>
					)}
				</div>
			</NavLinkAdapter>
		</Box>
	);
}

export default FolderItem;
