import { Menu, MenuItem, Typography } from '@mui/material';

const NavMenu = ({
  anchorEl,
  open,
  onClose,
  pages,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  pages: string[];
}) => (
  <Menu
    id="menu-appbar"
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    sx={{ display: { xs: 'block', md: 'none' } }}
  >
    {pages.map((page) => (
      <MenuItem key={page} onClick={onClose}>
        <Typography textAlign="center">{page}</Typography>
      </MenuItem>
    ))}
  </Menu>
);

export default NavMenu;