import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MenuButton = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLElement>) => void }) => (
  <IconButton
    size="large"
    aria-label="navigation menu"
    onClick={onClick}
    color="inherit"
  >
    <MenuIcon />
  </IconButton>
);

export default MenuButton;
