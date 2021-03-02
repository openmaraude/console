import BaseLayout from '../components/layouts/BaseLayout';
import LogasTable from '../components/LogasTable';

export default function ManagerPage() {
  return (
    <BaseLayout>
      <p>
        Cette page vous permet de vous connecter aux comptes dont vous avez la
        gestion. Une fois connecté, déconnectez-vous pour revenir sur votre
        compte.
      </p>

      <LogasTable />
    </BaseLayout>
  );
}
