import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { TextLink } from '@/components/LinksRef';

import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '@/components/layouts/MenuLayout';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.breakpoints.width('md'),
  },
  sideSections: {
    display: 'flex',
    justifyContent: 'space-around',

    '& > *': {
      margin: theme.spacing(2),
    },
  },
  sideSectionTitle: {
    textAlign: 'center',
  },
}));

export function Layout({ loading, children }) {
  const classes = useStyles();

  return (
    <MenuLayout className={classes.root}>
      <Menu>
        <MenuItem title="Introduction" href="/integration" />
        <MenuItem title="Simuler application opérateur" href="/integration/operator" />
        <MenuItem title="Simuler application client" href="/integration/search" />
      </Menu>
      <Content loading={loading}>
        { children }
      </Content>
    </MenuLayout>
  );
}

Layout.defaultProps = {
  loading: false,
};

Layout.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default function IntegrationPage() {
  const classes = useStyles();

  return (
    <Layout>
      <Typography variant="h4">Aide pour l'intégration</Typography>
      <p>
        Nous mettons à votre disposition des outils pour vous aider dans
        l'intégration de vos applications. Il est recommandé avant toute chose
        de prendre connaissance
        de la <Link href="/documentation/introduction" passHref><TextLink>documentation</TextLink></Link>.
      </p>

      <Box className={classes.sideSections}>
        <Card>
          <CardContent>
            <Typography className={classes.sideSectionTitle} variant="h6">
              Création d'une application client
            </Typography>

            <p>
              Vous souhaitez créer une application client afin de mettre en
              relation vos usagers avec les taxis de l'API. Comment faire pour
              tester votre application ? Comment reproduire le cas d'un taxi
              qui se déplace, qui devient occupé ou libre ?
            </p>

            <p>
              Le menu <Link href="/integration/operator" passHref><TextLink>application opérateur</TextLink></Link> vous permet
              de créer des taxis de test, de changer leur localisation,
              d'accepter des courses et de changer les statuts de celles-ci.
            </p>

            <p>
              Vous pouvez ainsi développer votre application client en simulant
              simplement un opérateur de taxis, et mettre en relation vos
              usagers avec les taxis de l'API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography className={classes.sideSectionTitle} variant="h6">
              Création d'une application chauffeur
            </Typography>
            <p>
              Vous souhaitez créer une application chauffeur afin d'envoyer à
              l'API la géolocalisation et la disponibilité de vos taxis.
              Comment faire pour simuler la demande de course de la part d'un
              client ? L'annulation de cette demande ?
            </p>

            <p>
              Le menu <Link href="/integration/search" passHref><TextLink>application client</TextLink></Link> vous
              permet de lister les taxis autour d'un point, d'effectuer une demande de course et de simuler le parcours
              client dans les différentes possibilités.
            </p>
            <p>
              Vous pouvez ainsi développer votre application opérateur en
              simulant une application client.
            </p>
          </CardContent>
        </Card>
      </Box>

    </Layout>
  );
}
