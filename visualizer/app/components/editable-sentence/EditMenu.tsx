import { IconButton, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';

interface EditMenuProps {
  onEditClick: () => void;
}

export function EditMenu({ onEditClick }: EditMenuProps) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            size: 'sm',
            variant: 'plain',
            color: 'neutral',
          },
        }}
      >
        <MoreVertIcon />
      </MenuButton>
      {/* @ts-expect-error Joy UI Menu has complex type definitions in beta */}
      <Menu placement="top-end">
        {/* @ts-expect-error Joy UI MenuItem has complex type definitions in beta */}
        <MenuItem onClick={onEditClick}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
