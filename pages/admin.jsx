import { getCurrentUser } from '../src/auth';

export default function AdminPage() {
  return (
    <div>Admin page</div>
  );
}

AdminPage.getInitialProps = async (ctx) => ({
  user: getCurrentUser(ctx),
});
