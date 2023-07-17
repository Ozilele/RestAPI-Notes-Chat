import React, { useEffect } from 'react'
import './LoginPage.css';
import getGoogleUrl from '../utils/getGoogleUrl';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {

  return (
    <div className="login_screen">
      <div className='login_content'>
        <h2>Welcome back to NotesApp</h2>
        <a className='login--link' href={getGoogleUrl()}>
          <button className='login--btn'>
            <GoogleIcon/>
            <span>Login with Google</span>
          </button>
        </a>
      </div>
    </div>
  )
}

export default LoginPage