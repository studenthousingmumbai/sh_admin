import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import api from '../../lib/api'
import Layout from '../../components/common/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import Pagination from '../../components/common/Pagination'; 
import { ScopeTypes } from '../../constants'
import Search from '../../components/common/Search';
import { getNumPages } from '../../utils/getNumPages';


const order_status_color_scheme = { 
    CREATED: ' bg-blue-100 text-blue-800', 
    COMPLETED: ' bg-green-100 text-green-800', 
    IN_PROGRESS: ' bg-yellow-100 text-yellow-800', 
    CANCELLED: ' bg-pink-100 text-pink-800'
}

const orders = [ 
    { 
        user:  "Tanay Kulkarni", 
        status: "CREATED", 
        listing_name:  "Ganga Nivas", 
        floor: "2", 
        room_no: "2", 
        bed: "1", 
        amount: "10000", 
        days_remaining: "__", 
        createdAt: "2023-01-30T13:07:43.836Z"
    }, 
    { 
        user:  "Varun Panchal", 
        status: "COMPLETED", 
        listing_name:  "Ganga Nivas", 
        floor: "2", 
        room_no: "1", 
        bed: "1", 
        amount: "10000", 
        days_remaining: "365", 
        createdAt: "2023-01-30T13:07:43.836Z"
    }, 
    { 
        user:  "Gaurav Bhatena", 
        status: "IN_PROGRESS", 
        listing_name:  "Ganga Nivas", 
        floor: "2", 
        room_no: "3", 
        bed: "1", 
        amount: "10000", 
        days_remaining: "__", 
        createdAt: "2023-01-30T13:07:43.836Z"
    }, 
    { 
        user:  "Kamlesh Bhatena", 
        status: "COMPLETED", 
        listing_name:  "Ganga Nivas", 
        floor: "5", 
        room_no: "2", 
        bed: "1", 
        amount: "10000", 
        days_remaining: "200", 
        createdAt: "2023-01-30T13:07:43.836Z"
    }, 
    { 
        user:  "Pavan Panchal", 
        status: "COMPLETED", 
        listing_name:  "Ganga Nivas", 
        floor: "2", 
        room_no: "5", 
        bed: "1", 
        amount: "10000", 
        days_remaining: "50", 
        createdAt: "2023-01-30T13:07:43.836Z"
    }
]

export default function Example() {
    const router = useRouter(); 
    // const [orders, setOrders] = useState([]); 
    const [sortOrder, setSortOrder] = useState("asc");
    const [pageLimit, setPageLimit] = useState(10); 
    const [totalPages, setTotalPages] = useState(1); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(5); 
    const [searchResults, setSearchResults] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const is_mounted = useRef(false); 

    useEffect(() => {
        if(!is_mounted.current) { 
            is_mounted.current = true; 
        }
        // get the first batch of users (skip 0 results)
        // fetchOrders(0); 
    }, []);

    // useEffect(() => {  
    //     if(is_mounted.current) { 
    //         console.log("Current page has changed: ", currentPage);
    //         if(currentPage > 1) { 
    //             fetchUsers((currentPage - 1) * pageLimit);
    //         } else{ 
    //             fetchUsers(0);
    //         }
    //     }
    // }, [currentPage]);
  
    // const fetchUsers = async (skip) => { 
    //     const { users: all_users, total } = await api.getUsers({ 
    //         filters: { scope: ScopeTypes.USER }, 
    //         skip, 
    //         limit: pageLimit 
    //     });
    //     const total_pages = getNumPages(total, pageLimit); 

    //     setTotalResults(total); 
    //     setUsers(all_users); 
    //     setTotalPages(total_pages); 
    // } 

    const sortOrders = (users, sortAttribute) => {
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
        <Layout title="Orders">
            <div className="sm:flex sm:items-center mb-3">
                <div className="sm:flex-auto">
                    {/* <h1 className="text-xl font-semibold text-gray-900">Listings</h1> */}
                    <p className="mt-2 text-sm text-gray-700">
                        All user orders
                    </p>
                </div>
            </div>

            <Search 
                placeholder="Search Orders"
                // api_endpoint='http://localhost:8000/user/search-users'
                // onResult={handleSearch}
            />

            <div className="mt-3 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full table-fixed divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="min-w-[12rem] py-3.5 px-6 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => { sortOrders(orders, "user")}}>
                                                User
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center"  onClick={() => sortOrders(orders, "listing_name")}>
                                                Listing 
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "floor")}>
                                                Floor  
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "room_no")}>
                                                Room No  
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "amount")}>
                                                Amount  
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "createdAt")}>
                                                Created On 
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "days_remaining")}>
                                                Days remaining  
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left px-6 text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex items-center" onClick={() => sortOrders(orders, "status")}>
                                                Status 
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                    <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true"/>
                                                </span>
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders.length > 0 && searchResults.length === 0 && searchQuery === "" && orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'> {order.user} </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.listing_name}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.floor}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.room_no}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.amount}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toDateString()}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                { 
                                                    order.days_remaining !== '__' && 
                                                    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" + (order.days_remaining > 200 ? ' bg-green-100 text-green-800' : order.days_remaining > 50 ? ' bg-yellow-100 text-yellow-800' : ' bg-pink-100 text-pink-800' )}>
                                                        {order.days_remaining}
                                                    </span>
                                                    || 
                                                    order.days_remaining
                                                }
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" + order_status_color_scheme[order.status]}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {
                                        searchQuery !== "" && searchResults.map((order) => (
                                            <tr key={order.id}>
                                                <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'> {order.user} </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.listing_name}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.floor}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.room_no}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.amount}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toDateString()}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    { 
                                                        order.days_remaining !== '__' && 
                                                        <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" + (order.days_remaining > 200 ? ' bg-green-100 text-green-800' : order.days_remaining > 50 ? ' bg-yellow-100 text-yellow-800' : ' bg-pink-100 text-pink-800' )}>
                                                            {order.days_remaining}
                                                        </span>
                                                        || 
                                                        order.days_remaining
                                                    }
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" + order_status_color_scheme[order.status]}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    {
                                        searchQuery === "" && 
                                        <tr>
                                            <td colSpan="8">
                                                <div className='flex w-full justify-end bg-red'> 
                                                    <Pagination 
                                                        totalPages={totalPages}
                                                        currentPage={currentPage} 
                                                        totalResults={totalResults}
                                                        resultsOnPage={orders.length}
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