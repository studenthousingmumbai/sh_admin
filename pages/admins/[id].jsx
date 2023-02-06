import Head from 'next/head'
import Layout from '../../components/common/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import { RoleTypes } from '../../constants';
import useApi from '../../hooks/useApi';

const roleOptions = [
    { id: RoleTypes.ADMIN, title: RoleTypes.ADMIN  },
    { id: RoleTypes.SUPERVISOR, title: RoleTypes.SUPERVISOR }
]; 
  
export default function Home() {
    const router = useRouter(); 
    const { isReady } = router; 
    const { id } = router.query; 

    const [firstName, setFirstname] = useState(""); 
    const [lastName, setLastName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [role, setRole] = useState(""); 
    const { updateUser, getUser } = useApi(); 

    useEffect(() => { 
        if(isReady){
            console.log("admin id: ", id); 
            fetchAdmin(id); 
        }
    }, [isReady]); 

    const fetchAdmin = async () => { 
        const admin = await getUser(id); 
        console.log("admin: ", admin); 

        setFirstname(admin.firstname); 
        setLastName(admin.lastname); 
        setEmail(admin.email); 
        setRole(admin.role); 
    }

    const resetForm = () => { 
        // reset form state 
        setFirstname(""); 
        setLastName(""); 
        setEmail("");
        setPassword(""); 
        setRole(""); 
      }
      
    const handleSubmit =  async (e) => { 
        e.preventDefault();
        
        const user_obj = {
            id, 
            firstname: firstName.trim(), 
            lastname: lastName.trim(), 
            email: email.trim(), 
            password, 
            role
        }; 

        if(password === "") { 
            delete user_obj.password; 
        }

        try{ 
            const response = await updateUser(user_obj); 
            console.log(response); 
        } 
        catch(err) { 
            console.log("error: ", err); 
        }
    
        resetForm(); 
        router.push('/admins');
    }

    return (
        <>
        <Head>
            <title>Edit Admin</title>
            <meta name="description" content="Create Admin" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
            <Layout> 
                <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5">
                        <div>
                            <div className='flex align-center'> 
                            <button
                                type="button"
                                className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                                onClick={() => router.push('/admins')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <h3 className="text-xl font-medium leading-6 text-gray-900 mt-0.5">Admin</h3>
                            </div>
                            <p className="mt-1 max-w-2xl text-md text-gray-500">
                                Edit admin user account 
                            </p>
                        </div>

                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Firstname 
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-lg rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={e => setFirstname(e.target.value)}
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Lastname 
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-lg rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Email 
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-lg rounded-md shadow-sm">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Password 
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-lg rounded-md shadow-sm">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Role 
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div>
                                    {/* <label className="text-base font-medium text-gray-900">Select Gender</label>
                                    <p className="text-sm leading-5 text-gray-500">Is this listing for males or females? </p> */}
                                    <fieldset className="mt-4">
                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            {roleOptions.map((option) => (
                                                <div key={option.id} className="flex items-center">
                                                <input
                                                    id={option.id}
                                                    name="notification-method"
                                                    type="radio"
                                                    value={option.id}
                                                    checked={role === option.id}
                                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    onChange={e => setRole(e.target.value)}
                                                />
                                                <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-gray-700">
                                                    {option.title}
                                                </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </div>
                    </div>
                    
                    <div className="pt-5">
                        <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => router.push('/listing')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                        </div>
                    </div>
                </form>
            </Layout>   
        </main>
        </>
    );
}