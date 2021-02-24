/*
 * Widget to display an API error response.
 */

import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';

import SyntaxHighlighter from 'react-syntax-highlighter';

export default function APIErrorAlert({ error, ...alertParams }) {
  let display = (
    <>
      Erreur inattendue. Contactez notre support technique si le problème persiste.
      <SyntaxHighlighter language="text">
        {error.message}
      </SyntaxHighlighter>
    </>
  );

  if (error.name === 'network-error') {
    display = `Erreur de connexion à l'API. Vous pouvez essayer de rafraichir la page. Contactez notre support technique si le problème persiste.`;
  } else if (error.name === 'json-error') {
    display = (
      <>
        {`Contenu inattendu de la réponse HTTP/${error.status} retournée par l'API :`}
        <SyntaxHighlighter language="text">
          {error.text}
        </SyntaxHighlighter>
      </>
    );
  } else if (error.name === 'http-error') {
    switch (error.status) {
      case 401:
        display = `Authentification requise. Vos identifiants sont-ils valides ?`;
        break;
      case 403:
        display = `Vous n'avez pas les permissions de voir cette ressource.`;
        break;
      default:
        display = (
          <>
            {`L'API a retourné une erreur HTTP/${error.status} :`}
            <SyntaxHighlighter language="json">
              {JSON.stringify(error.json, null, 2)}
            </SyntaxHighlighter>
          </>
        );
        break;
    }
  }

  return (
    <Box marginTop={2} marginBottom={2}>
      <Alert severity="error" {...alertParams} >
        {display}
      </Alert>
    </Box>
  );
}

APIErrorAlert.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string,
    status: PropTypes.number,
    text: PropTypes.string,
    json: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }).isRequired,
};
