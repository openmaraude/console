import { getCurrentUser } from '../src/auth';

export default function DashboardsPage() {
  return (
    <div>Dashboards page</div>
  );
}

DashboardsPage.getInitialProps = async (ctx) => ({
  user: getCurrentUser(ctx),
});
