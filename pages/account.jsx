import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { toast } from 'react-toastify';

import { getCurrentUser, hasRole } from '../src/auth';
import { getUserAccount, updateUserAccount } from '../src/account';
import APIErrorAlert from '../components/APIErrorAlert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  formSection: {
    marginBottom: theme.spacing(5),
  },
  formSectionTitle: {
    marginBottom: theme.spacing(1),
  },
  formEntry: {
    display: 'flex',
    alignItems: 'end',
    marginBottom: theme.spacing(2),
    '& > *': {
      flex: '1 1 0',
    },
    '& > *:not(:first-child)': {
      paddingLeft: theme.spacing(3),
    },
  },
  helpText: {
    color: theme.palette.info.light,
    fontSize: '0.75rem',
  },
  error: {
    marginBottom: theme.spacing(2),
  },
}));

export default function AccountPage({ user }) {
  const classes = useStyles();
  const [account, setAccount] = React.useState();
  const [apiError, setApiError] = React.useState();

  // Passwords are valid only if both are unset, or if both are set and equal.
  const passwordConfirmIsValid = (
    !account
    || (!account.password && !account.passwordConfirm)
    || account.password === account.passwordConfirm
  );

  React.useEffect(async () => {
    try {
      const obj = await getUserAccount(user.apikey, user.id);
      setAccount(obj);
    } catch (err) {
      setApiError(err);
    }
  }, [user]);

  function updateField(e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    // Remove confirmPassword from parameters sent to updateUserAccount.
    // The confirmation password should not be provided to the API, and is only
    // present to make sure the password provided is valid.
    const { passwordConfirm, ...params } = account;
    e.preventDefault();
    try {
      const updatedAccount = await updateUserAccount(user.apikey, user.id, params);
      toast.success('Mise à jour effectuée.');
      setAccount(updatedAccount);
      setApiError(null);
    } catch (err) {
      setApiError(err);
      toast.error('Impossible de mettre à jour le profil.');
    }
  }

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={10}>
        <form>
          <div className={classes.formSection}>
            <Typography variant="h4" className={classes.formSectionTitle}>Votre compte</Typography>

            <div className={classes.formEntry}>
              <div>
                <strong>Votre clé d'API :</strong> <small>{account?.apikey}</small>
              </div>
              <div className={classes.helpText}>
                Cette clé est un identifiant unique qui permet à vos applications
                de se connecter à nos APIs. Cette information est confidentielle :
                ne la transmettez jamais à des tiers. Si vous pensez que cette clé
                a été divulguée par erreur à des tiers, contactez nos équipes
                techniques pour la changer.
              </div>
            </div>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Nom commercial"
                  name="name"
                  fullWidth
                  disabled={!account}
                  value={account?.name || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Nom affiché lorsque faisons référence à votre compte.
              </div>
            </div>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  fullWidth
                  disabled={!account}
                  value={account?.password || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Laissez vide pour garder votre mot de passe actuel.
              </div>
            </div>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Confirmation"
                  name="passwordConfirm"
                  type="password"
                  error={!passwordConfirmIsValid}
                  fullWidth
                  disabled={!account}
                  value={account?.passwordConfirm || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Pour changer le mot de passe, spécifier le même que celui ci-dessus.
              </div>
            </div>
          </div>

          {hasRole(user, 'operateur') && (
            <div className={classes.formSection}>
              <Typography variant="h4" className={classes.formSectionTitle}>API</Typography>

              <div className={classes.formEntry}>
                <div>
                  <TextField
                    label="URL de votre API"
                    name="hail_endpoint_production"
                    fullWidth
                    disabled={!account}
                    value={account?.hail_endpoint_production || ""}
                    onChange={updateField}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className={classes.helpText}>
                  Lorsqu'un moteur de recherche effectue une demande de course à un
                  taxi connecté sur votre application, nous faisons un appel vers cet
                  endpoint pour vous signaler cette demande. Référez-vous à la
                  documentation pour plus d'informations.
                </div>
              </div>

              <div className={classes.formEntry}>
                <div>
                  <TextField
                    label="Header"
                    name="operator_header_name"
                    fullWidth
                    disabled={!account}
                    value={account?.operator_header_name || ""}
                    onChange={updateField}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className={classes.helpText}>
                  Lorsque l'endpoint renseigné ci-dessus est appelé lors d'une
                  demande de course, nous fournissons un header HTTP vous permettant
                  de nous authentifier. Ce champs permet de configurer le nom de ce
                  header.
                </div>
              </div>

              <div className={classes.formEntry}>
                <div>
                  <TextField
                    label="Valeur header"
                    name="operator_api_key"
                    fullWidth
                    disabled={!account}
                    value={account?.operator_api_key || ""}
                    onChange={updateField}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className={classes.helpText}>
                  Contenu du header HTTP configuré ci-dessus.
                </div>
              </div>
            </div>
          )}

          <div className={classes.formSection}>
            <Typography variant="h4" className={classes.formSectionTitle}>Service technique</Typography>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Tél. technique"
                  name="phone_number_technical"
                  fullWidth
                  disabled={!account}
                  value={account?.phone_number_technical || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Numéro pour contacter votre support technique.
              </div>
            </div>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Email technique"
                  name="email_technical"
                  fullWidth
                  disabled={!account}
                  value={account?.email_technical || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Email pour contacter votre support technique.
              </div>
            </div>
          </div>

          <div className={classes.formSection}>
            <Typography variant="h4" className={classes.formSectionTitle}>Service client</Typography>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Tél. service client"
                  name="phone_number_customer"
                  fullWidth
                  disabled={!account}
                  value={account?.phone_number_customer || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Numéro pour contacter votre support client.
              </div>
            </div>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="Email service client"
                  name="email_customer"
                  fullWidth
                  disabled={!account}
                  value={account?.email_customer || ""}
                  onChange={updateField}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className={classes.helpText}>
                Email pour contacter votre support client.
              </div>
            </div>
          </div>

          {apiError && <APIErrorAlert className={classes.error} error={apiError} />}

          <Button type="submit" variant="contained" color="primary" disabled={!passwordConfirmIsValid} onClick={onSubmit}>
            Mettre à jour
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

AccountPage.propTypes = {
  user: PropTypes.shape({
    apikey: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

AccountPage.getInitialProps = async (ctx) => ({
  user: getCurrentUser(ctx),
});
