import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/common/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import Pagination from '../components/common/Pagination'; 
import { ScopeTypes } from '../constants'
import Search from '../components/common/Search';
import { getNumPages } from '../utils/getNumPages';
import useApi from '../hooks/useApi';

export default function Example() {
    const router = useRouter(); 
    const [users, setUsers] = useState([]); 
    const [sortOrder, setSortOrder] = useState("asc");
    const [pageLimit, setPageLimit] = useState(10); 
    const [totalPages, setTotalPages] = useState(10); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(100); 
    const [searchResults, setSearchResults] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const is_mounted = useRef(false); 
    const { getUsers } = useApi(); 

    useEffect(() => {   
        if(!is_mounted.current) { 
            is_mounted.current = true; 
        }
        // get the first batch of users (skip 0 results)
        fetchUsers(0); 
    }, []);

    useEffect(() => {  
        if(is_mounted.current) { 
            console.log("Current page has changed: ", currentPage);
            if(currentPage > 1) { 
                fetchUsers((currentPage - 1) * pageLimit);
            } else{ 
                fetchUsers(0);
            }
        }
    }, [currentPage]);
  
    const fetchUsers = async (skip) => { 
        const { users: all_users, total } = await getUsers({ 
            filters: { scope: ScopeTypes.USER }, 
            skip, 
            limit: pageLimit 
        });
        const total_pages = getNumPages(total, pageLimit); 

        setTotalResults(total); 
        setUsers(all_users); 
        setTotalPages(total_pages); 
    } 

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

        setUsers(sortedUsers);
    };

    const handleSearch = (searchTerm, results) => { 
        setSearchQuery(searchTerm); 
        setSearchResults(results);  
    }

    return (
        <Layout title="Users">
            <div className="sm:flex sm:items-center mb-3">
                <div className="sm:flex-auto">
                    {/* <h1 className="text-xl font-semibold text-gray-900">Listings</h1> */}
                    <p className="mt-2 text-sm text-gray-700">
                        Users signed up on Student Housing
                    </p>
                </div>
            </div>

            <Search 
                placeholder="Search Users"
                api_endpoint='http://localhost:8000/user/search-users'
                onResult={handleSearch}
            />

            <div className="mt-3 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="min-w-[12rem] py-3.5 px-6 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => { sortUsers(users, "firstname")}}>
                                                Name
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center"  onClick={() => sortUsers(users, "email")}>
                                                Email
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortUsers(users, "createdAt")}>
                                                Joined On  
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.length > 0 && searchResults.length === 0 && searchQuery === "" && users.map((user) => (
                                        <tr key={user.id}>
                                            <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                                                {user.firstname + " " + user.lastname}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toDateString()}</td>
                                        </tr>
                                    ))}
                                    
                                    {
                                        searchQuery !== "" && searchResults.map((user) => (
                                            <tr key={user.id}>
                                                <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                                                    {user.firstname + " " + user.lastname}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toDateString()}</td>
                                            </tr>
                                        ))
                                    }

                                    {
                                        searchQuery === "" && 
                                        <tr>
                                            <td colSpan="4">
                                                <div className='flex w-full justify-end bg-red'> 
                                                    <Pagination 
                                                        totalPages={totalPages}
                                                        currentPage={currentPage} 
                                                        totalResults={totalResults}
                                                        resultsOnPage={users.length}
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
        </Layout>
    )
}