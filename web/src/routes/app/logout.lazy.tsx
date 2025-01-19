import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/logout')({
  component: AppLogout,
});

function AppLogout() {
  const navigate = useNavigate();
  navigate({
    to: '/',
  });
}
