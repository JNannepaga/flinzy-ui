import { Avatar, IconButton } from '@mui/material';

const UserAvatar = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLElement>) => void }) => (
  <IconButton onClick={onClick} sx={{ p: 0 }}>
    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
  </IconButton>
);

export default UserAvatar;