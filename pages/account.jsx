import React from 'react';

import useSWR from 'swr';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { toast } from 'react-toastify';

import { hasRole, UserContext } from '../src/auth';
import { getUserAccount, updateUserAccount } from '../src/account';
import APIErrorAlert from '../components/APIErrorAlert';
import BaseLayout from '../components/layouts/BaseLayout';

const useStyles = makeStyles((theme) => ({
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

export default function AccountPage() {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const { data, error, mutate } = useSWR(
    [userContext.user.apikey, userContext.user.id, getUserAccount.name],
    getUserAccount,
    { revalidateOnFocus: false },
  );

  // Passwords are valid only if both are unset, or if both are set and equal.
  const passwordConfirmIsValid = (
    !data
    || (!data.password && !data.passwordConfirm)
    || data.password === data.passwordConfirm
  );

  async function updateField(e) {
    mutate(
      { ...data, [e.target.name]: e.target.value },
      false,
    );
  }

  async function onSubmit(e) {
    // Remove confirmPassword from parameters sent to updateUserAccount.
    // The confirmation password should not be provided to the API, and is only
    // present to make sure the password provided is valid.
    const { passwordConfirm, ...params } = data;
    e.preventDefault();

    try {
      await mutate(
        updateUserAccount(userContext.user.apikey, userContext.user.id, params),
        false,
      );
      toast.success('Mise à jour effectuée.');
      await mutate(); // resynchronize data
    } catch {
      toast.error('Impossible de mettre à jour le profil.');
    }
  }

  return (
    <BaseLayout loading={!data}>
      <form onSubmit={onSubmit}>
        <div className={classes.formSection}>
          <Typography variant="h4" className={classes.formSectionTitle}>Votre compte</Typography>

          <Box marginBottom={5}>
            <div className={classes.formEntry}>
              <div>
                <strong>Votre clé d'API :</strong> <small>{data?.apikey}</small>
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
                <strong>Votre identifiant :</strong> <small>{data?.email}</small>
              </div>
              <div className={classes.helpText}>
                Identifiant utilisé pour vous connecter. Vous ne pouvez pas en changer.
              </div>
            </div>
          </Box>

          <div className={classes.formEntry}>
            <div>
              <TextField
                label="Nom commercial"
                name="name"
                fullWidth
                value={data?.name || ""}
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
                error={!!error?.json.errors.data[0].password}
                fullWidth
                value={data?.password || ""}
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
                value={data?.passwordConfirm || ""}
                onChange={updateField}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className={classes.helpText}>
              Pour changer le mot de passe, spécifier le même que celui ci-dessus.
            </div>
          </div>
        </div>

        {hasRole(userContext.user, 'operateur') && (
          <div className={classes.formSection}>
            <Typography variant="h4" className={classes.formSectionTitle}>API</Typography>

            <div className={classes.formEntry}>
              <div>
                <TextField
                  label="URL de votre API"
                  name="hail_endpoint_production"
                  fullWidth
                  value={data?.hail_endpoint_production || ""}
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
                  value={data?.operator_header_name || ""}
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
                  value={data?.operator_api_key || ""}
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
                value={data?.phone_number_technical || ""}
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
                value={data?.email_technical || ""}
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
                value={data?.phone_number_customer || ""}
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
                value={data?.email_customer || ""}
                onChange={updateField}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className={classes.helpText}>
              Email pour contacter votre support client.
            </div>
          </div>
        </div>

        {error && <APIErrorAlert className={classes.error} error={error} />}

        <Button type="submit" variant="contained" color="primary" disabled={!data || !passwordConfirmIsValid}>
          Mettre à jour
        </Button>
      </form>
    </BaseLayout>
  );
}
