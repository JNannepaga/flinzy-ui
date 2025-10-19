import { Menu, MenuItem, Typography } from '@mui/material';

const UserMenu = ({
  anchorEl,
  open,
  onClose,
  settings,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  settings: string[];
}) => (
  <Menu
    sx={{ mt: '45px' }}
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    {settings.map((setting) => (
      <MenuItem key={setting} onClick={onClose}>
        <Typography textAlign="center">{setting}</Typography>
      </MenuItem>
    ))}
  </Menu>
);

export default UserMenu;