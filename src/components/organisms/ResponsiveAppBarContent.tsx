import { Box, Button, Toolbar, Tooltip, Container } from '@mui/material';
import { useState } from 'react';
import Logo from '../atoms/Logo';
import UserAvatar from '../atoms/UserAvatar';
import UserMenu from '../molecules/UserMenu';

const pages = ['Boards', 'Stats'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBarContent = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Logo />

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white' }}>
              {page}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <span>
              <UserAvatar onClick={handleOpenUserMenu} />
            </span>
          </Tooltip>
          <UserMenu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            settings={settings}
          />
        </Box>
      </Toolbar>
    </Container>
  );
};

export default ResponsiveAppBarContent;