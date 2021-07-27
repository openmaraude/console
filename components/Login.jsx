import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import { TextLink } from '@/components/LinksRef';
import { UserContext } from '@/src/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(/images/banner.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginForm() {
  const classes = useStyles();
  const [authenticationError, setAuthenticationError] = React.useState();
  const userContext = React.useContext(UserContext);

  function onSubmit(event) {
    userContext.authenticate({
      email: event.target.email.value,
      password: event.target.password.value,
    }).catch((apiError) => setAuthenticationError(apiError));
    event.preventDefault();
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Connexion à la console&nbsp;
            <TextLink target="_blank" href="https://le.taxi">le.taxi</TextLink>
          </Typography>
          <form method="POST" className={classes.form} onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Identifiant"
              name="email"
              autoComplete="username"
              autoFocus
              error={!!authenticationError}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!authenticationError}
            />

            {!!authenticationError
                && <APIErrorAlert error={authenticationError} />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Connexion
            </Button>
          </form>

          <p>
            Vous êtes un opérateur de taxis ou un applicatif client, mais
            n'avez pas de compte pour vous connecter ? Faites la demande de
            création en vous rendant sur
            le <TextLink target="_blank" href="https://api.gouv.fr/les-api/le-taxi/demande-acces">formulaire de création de compte</TextLink>.
          </p>
        </div>
      </Grid>
    </Grid>
  );
}
