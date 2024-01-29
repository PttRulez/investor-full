import NextAuthProvider from './next-auth';
import ReactQueryProvider from './react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <NextAuthProvider>{children}</NextAuthProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
