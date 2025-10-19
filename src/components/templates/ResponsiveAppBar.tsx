import { AppBar } from '@mui/material';
import ResponsiveAppBarContent from '../organisms/ResponsiveAppBarContent';

const ResponsiveAppBar = () => (
  <AppBar position="static" sx={{ backgroundColor: '#2253A2' }}>
    <ResponsiveAppBarContent />
  </AppBar>
);

export default ResponsiveAppBar;