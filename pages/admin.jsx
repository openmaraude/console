import React from 'react';

import { makeStyles } from '@mui/styles';

import BaseLayout from '@/components/layouts/BaseLayout';
import LogasTable from '@/components/LogasTable';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.breakpoints.values.md,
  },
}));

export default function AdminPage() {
  const classes = useStyles();

  return (
    <BaseLayout maxWidth="lg" className={classes.root}>
      <p>
        Cette fonctionnalité permet aux administrateurs de se connecter en tant
        que n'importe quel utilisateur. Une fois connecté, déconnectez-vous
        pour revenir sur votre compte d'administration.
      </p>

      <LogasTable />
    </BaseLayout>
  );
}
