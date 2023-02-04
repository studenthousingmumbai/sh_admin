import Head from 'next/head'
import Layout from '../../components/common/Layout';
import CreateListingForm from '../../components/Listings/CreateListingForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Test page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout> 
            <CreateListingForm/>
        </Layout>   
      </main>
    </>
  );
}