import { Footer } from '../components/footer';
import { Header } from '../components/header';

export function DefaultTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <hr />
      <main>{children}</main>
      <hr />
      <Footer />
    </>
  );
}
