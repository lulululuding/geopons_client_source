import React, { useContext, useState, useMemo, memo, useCallback, useRef, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import Icon from '@material-ui/core/Icon';
import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';
import { BASE_URL } from '../../client';
import './Login.css';
import { GET_VERIFY } from '../../graphql/queries';
import MySnackBar from '../MySnackBar';

const LoginStatus = {
  "PhoneNumInput": 1,
  "Verify": 2,
  "Success": 3
};

const VerifyComponent = memo(({ setStatus, phoneNum }) => {
  const [ isAble, setIsAble ] = useState(true);
  const [ , setInput ] = useState('');
  const [ countdown, setCountDown ] = useState(60);
  const [ isSnackOpen, setSnackOpen ] = useState(false);
  const verifyCodeRef = useRef();
  const snackMsgRef = useRef('');

  const onInput = useCallback( e  => {
    const _input = e.target.value.trim();
    if ( _input.length !== 4 ) return; 
    setInput(_input);
    verify(_input);
  }, [ setInput ]);

  const verify = useCallback( code => {
    if (code === verifyCodeRef.current){
      setStatus(LoginStatus.Success);
    } else {
      snackMsgRef.current = "Sorry Wrong Verify Code";
      setSnackOpen(true);
    }
  }, [ verifyCodeRef, snackMsgRef ]);

  const onclick = useCallback(() => {
    setIsAble(false);
    setCountDown(60);
    let countDown = 60;
    const interval = setInterval(() => {
      countDown -= 1;
      setCountDown(countDown);
      if (countDown === 0) {
        clearInterval(interval);
        setIsAble(true);
      }
    }, 1000);
    getVerifyCode();
  }, [ setIsAble, setCountDown ]);

  const getVerifyCode = useCallback(async () => {
    const client = new GraphQLClient(BASE_URL, {
      headers: { authorization: phoneNum }
    });
    const resp = await client.request(GET_VERIFY, { phoneNum });
    // console.log(resp);
    verifyCodeRef.current = resp.verify.res;
  }, [ phoneNum, verifyCodeRef ]);

  const closeSnack = useCallback(() => {
    setSnackOpen(false);
  }, [ setSnackOpen ]);

  return (
    <div style={styles.verifyWrapper}>
      <MySnackBar isOpen={isSnackOpen} msg={snackMsgRef.current} close={closeSnack} />
      <TextField 
        autoFocus
        id="centerText" 
        label="Verify Code"  
        onChange={onInput}
        // disabled={isVerify}
      />
      <Button
        variant="contained"
        size="small"
        color="primary"
        // endIcon={<Icon>send</Icon>}
        disabled={!isAble}
        onClick={onclick}
      >
        { isAble ? 'Send' : countdown }
      </Button>
    </div>
  );
});

const PhoneNumInput = memo(({ setStatus, setPhoneNum }) => {

  const [ input, setInput ] = useState('');
 
  const onInput = useCallback( e => {
    const { value } = e.target;
    setInput(value.trim());
  }, [ setInput ]);

  const onClick = useCallback(() => {
    setPhoneNum(input);
    setStatus(LoginStatus.Verify);
  }, [ input, setPhoneNum, setStatus ]);

  return (
    <div style={styles.phoneInputWrapper}>
      <TextField 
        autoFocus
        id="centerText" 
        label="Phone Number"  
        onChange={onInput}
        style={styles.phoneNumInput}
      />
      <Button
        variant="contained"
        color="primary"
        // endIcon={<Icon>send</Icon>}
        disabled={input.trim().length === 0}
        onClick={onClick}
      >
        Go
      </Button>
    </div>
  )
});

const SuccessComponent = memo(({ onSuccess }) => {

  useEffect(() => {
    onSuccess();
  }, [ onSuccess ]);

  return (
    <>
      Success
    </>
  );
});

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const [ status, setStatus ] = useState(LoginStatus.PhoneNumInput);
  const [ phoneNum, setPhoneNum ] = useState('');

  const onSuccess = async googleUser => {
    try {
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: phoneNum }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.error('Error logging in', err);
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
  };

  const statusComponent = useMemo(() => {
    if (status === LoginStatus.PhoneNumInput) {
      return <PhoneNumInput setStatus={setStatus} setPhoneNum={setPhoneNum} />
    }
    else if (status === LoginStatus.Verify) {
      return <VerifyComponent setStatus={setStatus} phoneNum={phoneNum} />
    }
    else if (status === LoginStatus.Success){
      return <SuccessComponent onSuccess={onSuccess} />
    }
  }, [ status, setStatus, phoneNum, setPhoneNum ]);

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)' }}
      >
        Welcome
      </Typography>
      
      { statusComponent }
      {/* <GoogleLogin
        clientId="402948081568-in810vgg813vmvp5k48rji3kbgdtqb33.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        buttonText="Login with Google"
        theme="dark"
      /> */}
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  phoneInputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '90vw',
    maxWidth: '300px'
  },
  phoneNumInput: {
    margin: '0 0 20px',
  },
  verifyWrapper: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90vw',
    maxWidth: '300px' 
  },
  centerText: {
    textAlign: 'center',
    letterSpacing: '5px'
  }
};

export default withStyles(styles)(Login);
