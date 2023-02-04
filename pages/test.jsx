import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/common/Layout';
import Table from '../components/Users/Table';
import MultiUpload from '../components/common/MultiUpload/MultiUpload';
import DynamicList from '../components/common/DynamicList';
import { field_types, field_variants } from '../constants';

const fields = {
  name: {
    type: field_types.TEXT,
    variant: field_variants[field_types.TEXT].text,
    label: "Name",
    name: "name",
    placeholder: "Enter Name",
    required: true,
  },
  email: {
    type: field_types.TEXT, 
    variant: field_variants[field_types.TEXT].email,
    label:  "Email",
    name: "email",
    placeholder: "Enter Email",
    required: true
  },
  password: {
    type: field_types.TEXT, 
    variant: field_variants[field_types.TEXT].password,
    label: "Password",
    name: "password",
    placeholder: "Enter Password",
    required: true
  }, 
  images: { 
    type: field_types.FILES, 
    variant: null,
    label: "Property Images", 
    name: 'images', 
    required: false
  }
};

const layout = [ 
  ['name', 'email', 'password'], 
  ['images']
]

const values = [
  {
    name: "Tanay Kulkarni",
    email: "tanaykulkarni7@gmail.com",
    password: "1234"
  },
  {
    name: "Rohan Chhabria",
    email: "rohan@gmail.com",
    password: "1234"
  },
  {
    name: "Ansh Nagpal",
    email: "ansh@gmail.cokm",
    password: "1234"
  },
]


export default function Home() {
  return (
    <>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Test page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout title="Input Fields Test"> 
            {/* <MultiUpload/> */}
            <DynamicList 
              fields={fields} 
              values={values} 
              layout={layout} 
              onChange={(change) => console.log("Dynamic list changed: ", change)}
            />
        </Layout>   
      </main>
    </>
  );
}