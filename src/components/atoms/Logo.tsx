import { Typography } from '@mui/material';
import FlinzyIcon from '../../assets/flinzy.svg';

const Logo = ({ size = 50 }: { size?: number }) => (
  <>
    <img src={FlinzyIcon} alt="Flinzy Logo" style={{ width: size, height: size }} />
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        ml: 2,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
        display: { xs: 'none', md: 'flex' },
      }}
    >
      FLINZY
    </Typography>
  </>
);

export default Logo;