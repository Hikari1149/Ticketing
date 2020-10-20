import buildClient from '../api/build-client';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentuser }) => {
  return (
    <div>
      <Header currentuser={currentuser} />

      <div className="container">
        <Component {...pageProps} currentuser={currentuser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentuser
    );
  }

  return {
    pageProps,
    currentuser: data.currentuser,
  };
};

export default AppComponent;
