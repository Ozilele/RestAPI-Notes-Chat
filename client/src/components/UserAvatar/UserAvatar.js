import React from 'react';
import './UserAvatar.css';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.1)',
      opacity: 0,
    },
  },
}));


const UserAvatar = ({ isOnline, color, content }) => {

  return (
    <>
    {isOnline ? <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      <Avatar sx={{bgcolor: color}} alt={`${color}.${content}`}>{content}</Avatar>
    </StyledBadge> : <Avatar 
          sx={{bgcolor: color}} 
          alt={`${color}.${content}`}>{content}</Avatar>}
    </>
  )
}

export default UserAvatar;