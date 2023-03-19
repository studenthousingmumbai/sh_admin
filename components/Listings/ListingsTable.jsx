import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import Pagination from '../../components/common/Pagination'; 
import Search from '../../components/common/Search';
import Switch from '../../components/common/Switch'; 
import Modal from '../../components/common/Modal'; 

import { getNumPages } from '../../utils/getNumPages';
import useApi from '../../hooks/useApi';

export default function Example() {
  const router = useRouter(); 
  const [listings, setListings] = useState([]); 
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageLimit, setPageLimit] = useState(10); 
  const [totalPages, setTotalPages] = useState(10); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalResults, setTotalResults] = useState(100); 
  const [searchResults, setSearchResults] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const is_mounted = useRef(false); 
  const [warningOpen, setWarningOpen] = useState(false); 
  const [editListingId, setEditListingId] = useState(""); 

  const { getAllListings, updateListing, getOrders } = useApi();

  useEffect(() => {
    if(!is_mounted.current) { 
        is_mounted.current = true; 
    }
    // get the first batch of users (skip 0 results)
    fetchListings(0); 
  }, []);

  useEffect(() => {  
    if(is_mounted.current) { 
        console.log("Current page has changed: ", currentPage);
        if(currentPage > 1) { 
          fetchListings((currentPage - 1) * pageLimit);
        } else{ 
          fetchListings(0);
        }
    }
  }, [currentPage]);

  const fetchListings = async (skip) => { 
    const { listings: all_listings, total } = await getAllListings({ 
      filters: {}, 
      skip, 
      limit: pageLimit
    }); 
    const total_pages = getNumPages(total, pageLimit); 

    console.log("All listings: " , all_listings);

    setTotalResults(total); 
    setListings(all_listings); 
    setTotalPages(total_pages); 
  } 

  const sortListings = (items, sortAttribute) => {
    let sortedUsers = [...items];

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

    setListings(sortedUsers);
  };

  const handleSearch = (searchTerm, results) => { 
    setSearchQuery(searchTerm); 
    setSearchResults(results);  
  }

  const publishListing = async (id, value) => { 
    const data = new FormData(); 

    data.append('id', id); 
    data.append('publish', value);

    const update_response = await updateListing(data); 

    console.log("update response: ", update_response); 

    fetchListings((currentPage - 1) * pageLimit);
  }

  const handleEditClick = async (listing_id) => { 
    let hasActiveOrders = false; 
    const { orders } = await getOrders({ 
      filters: { 
        listing: listing_id
      }, 
      skip: 0, 
      limit: 0 
    }); 

    setEditListingId(listing_id); 

    if(orders.length > 0) { 
      for(let order of orders) { 
        if(order.days_remaining > 0) { 
          hasActiveOrders = true; 
          break; 
        }
      }
    }

    // check if the listing has active orders 
    if(hasActiveOrders){ 
      setWarningOpen(true); 
    }
    else { 
      router.push(`/listing/${listing_id}`); 
      setEditListingId(""); 
    }
  }

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
            {/* <h1 className="text-xl font-semibold text-gray-900">Listings</h1> */}
            <p className="mt-2 text-sm text-gray-700">
                A list of all property listings on Student Housing. 
            </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => router.push('/listing/create')}
          >
            Add Listing
          </button>
        </div>
      </div>

      <Search 
        placeholder="Search Listings"
        api_endpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/listing/search-listings`}
        onResult={handleSearch}
      />
  
      <Modal title={"This listing has active orders"} open={warningOpen} onClose={() => { setWarningOpen(false); setEditListingId(""); }}>
        <div className='mb-3'> 
          <span>Are you sure you want to edit this listing? It currently has active orders.</span>
        </div>
        <button
          type='button'
          className="mr-2 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600  px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-indigo-700 bg-[#ffcc29] hover:bg-[#fad45a]"
          onClick={() => router.push(`/listing/${editListingId}`)}
        >
          Yes Edit
        </button>
        <button
          type='button'
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-gray-100  px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-200"
          onClick={() => { setWarningOpen(false); setEditListingId(""); }}
        >
          Cancel
        </button>
      </Modal>

      <div className="mt-3 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "name")}}>
                        Listing Name
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "description")}}>
                        Description
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "price")}}>
                        Price
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "gender")}}>
                        Gender
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "gender")}}>
                        Status
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 px-6">
                      <a href="#" className="group inline-flex items-center" onClick={() => { sortListings(listings, "gender")}}>
                        Publish
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                            <ChevronUpIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                            <ChevronDownIcon className="h-4 w-4 hover:text-gray-300" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 px-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {listings.length > 0 && searchResults.length === 0 && searchQuery === "" && listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                        {listing.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.price}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.gender}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.publish ? 'Active' : "Inactive"}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">
                        <Switch onChange={value => publishListing(listing.id, value)} enabled={listing.publish}/>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 px-6 ">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => handleEditClick(listing.id)}>
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}

                  {searchQuery !== "" && searchResults.map((listing) => (
                    <tr key={listing.id}>
                      <td className='whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 px-6'>
                        {listing.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.price}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.gender}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">{listing.publish ? 'Active' : "Inactive"}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 px-6">
                        <Switch onChange={value => publishListing(listing.id, value)} enabled={listing.publish}/>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 px-6 ">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => handleEditClick(listing.id)}>
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}

                  {
                    searchQuery === "" && 
                    <tr>
                        <td colSpan="7">
                            <div className='flex w-full justify-end bg-red'> 
                                <Pagination 
                                    totalPages={totalPages}
                                    currentPage={currentPage} 
                                    totalResults={totalResults}
                                    resultsOnPage={listings.length}
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
  )
}