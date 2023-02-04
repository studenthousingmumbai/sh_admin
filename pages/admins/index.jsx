import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import api from '../../lib/api'
import Layout from '../../components/common/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import Pagination from '../../components/common/Pagination'; 
import { ScopeTypes } from '../../constants'
import Search from '../../components/common/Search';
import { getNumPages } from '../../utils/getNumPages';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const router = useRouter(); 
//   const checkbox = useRef()
//   const [checked, setChecked] = useState(false)
//   const [indeterminate, setIndeterminate] = useState(false)
//   const [selectedItems, setSelectedItems] = useState([])
    const [admins, setAdmins] = useState([]); 

    const [sortOrder, setSortOrder] = useState("asc");
    const [pageLimit, setPageLimit] = useState(10); 
    const [totalPages, setTotalPages] = useState(10); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(100); 
    const [searchResults, setSearchResults] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const is_mounted = useRef(false); 

    useEffect(() => {
        if(!is_mounted.current) { 
            is_mounted.current = true; 
        }
        // get the first batch of users (skip 0 results)
        fetchAdmins(0); 
    }, []);

    useEffect(() => {  
        if(is_mounted.current) { 
            console.log("Current page has changed: ", currentPage);
            if(currentPage > 1) { 
                fetchAdmins((currentPage - 1) * pageLimit);
            } else{ 
                fetchAdmins(0);
            }
        }
    }, [currentPage]);

//   useLayoutEffect(() => {
//     const isIndeterminate = selectedItems.length > 0 && selectedItems.length < admins.length
//     setChecked(selectedItems.length === admins.length && admins.length !== 0)
//     setIndeterminate(isIndeterminate)
//     checkbox.current.indeterminate = isIndeterminate
//     console.log("Selected items changed: ", selectedItems);
//   }, [selectedItems]); 


  const fetchAdmins = async (skip) => { 
    const { users: admins, total } = await api.getUsers({ 
        filters: { scope: ScopeTypes.ADMIN }, 
        skip, 
        limit: pageLimit  
    }); 
    const total_pages = getNumPages(total, pageLimit); 

    setTotalResults(total); 
    setAdmins(admins); 
    setTotalPages(total_pages); 
  } 

//   function toggleAll() {
//     setSelectedItems(checked || indeterminate ? [] : listings)
//     setChecked(!checked && !indeterminate)
//     setIndeterminate(false)
//   }

    const sortUsers = (users, sortAttribute) => {
        let sortedUsers = [...users];

        if (sortOrder === "asc") {
            sortedUsers.sort((a, b) => {
                return a[sortAttribute].localeCompare(b[sortAttribute]);
            });
            setSortOrder("desc");
        } else {
            sortedUsers.sort((a, b) => {
                return b[sortAttribute].localeCompare(a[sortAttribute]);
            });
            setSortOrder("asc");
        }

        setAdmins(sortedUsers);
    };

    const handleSearch = (searchTerm, results) => { 
        setSearchQuery(searchTerm); 
        setSearchResults(results);  
    }

  return (
    <Layout title="Admins">
        <div className="">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    {/* <h1 className="text-xl font-semibold text-gray-900">Listings</h1> */}
                    <p className="mt-2 text-sm text-gray-700">
                        All admin users
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        onClick={() => router.push('/admins/create')}
                    >
                        Add Admin
                    </button>
                </div>
            </div>
            
            <Search 
                placeholder="Search Admins"
                api_endpoint='http://localhost:8000/user/search-admins'
                onResult={handleSearch}
            />

            <div className="mt-3 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            {/* {selectedItems.length > 0 && (
                                <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        Bulk edit
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        Delete all
                                    </button>
                                </div>
                            )} */}
                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {/* <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                            <input
                                                type="checkbox"
                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                ref={checkbox}
                                                checked={checked}
                                                onChange={toggleAll}
                                            />
                                        </th> */}
                                        <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 px-6">
                                            <a href="#" className="group inline-flex items-center" onClick={() => { sortUsers(admins, "firstname")}}>
                                                Admin Name
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                                            <a href="#" className="group inline-flex items-center"  onClick={() => sortUsers(admins, "email")}>
                                                Email
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                                            Role  
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 px-6">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {admins.length > 0 && searchResults.length === 0 && searchQuery === "" && admins.map((admin) => (
                                        <tr key={admin.id}>
                                            {/* <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                {selectedItems.includes(admin) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />)}
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                    value={admin.id}
                                                    checked={selectedItems.includes(admin)}
                                                    onChange={(e) => setSelectedItems(e.target.checked ? [...selectedItems, admin] : selectedItems.filter((p) => p !== admin))}
                                                />
                                            </td> */}
                                            <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                                                {admin.firstname + " " + admin.lastname}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{admin.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{admin.role}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 px-6">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => router.push(`/admins/${admin.id}`)}>
                                                    Edit
                                                </a>
                                            </td>
                                        </tr>
                                    ))}

                                    {searchQuery !== "" && searchResults.map((admin) => (
                                        <tr key={admin.id}>
                                            {/* <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                                {selectedItems.includes(admin) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />)}
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                                    value={admin.id}
                                                    checked={selectedItems.includes(admin)}
                                                    onChange={(e) => setSelectedItems(e.target.checked ? [...selectedItems, admin] : selectedItems.filter((p) => p !== admin))}
                                                />
                                            </td> */}
                                            <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                                                {admin.firstname + " " + admin.lastname}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{admin.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{admin.role}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 px-6">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => router.push(`/admins/${admin.id}`)}>
                                                    Edit
                                                </a>
                                            </td>
                                        </tr>
                                    ))}

                                    {
                                        searchQuery === "" && 
                                        <tr>
                                            <td colSpan="4">
                                                <div className='flex w-full justify-end bg-red'> 
                                                    <Pagination 
                                                        totalPages={totalPages}
                                                        currentPage={currentPage} 
                                                        totalResults={totalResults}
                                                        resultsOnPage={admins.length}
                                                        onPageChange={(pageNumber) => {setCurrentPage(pageNumber)}} 
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    }   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}