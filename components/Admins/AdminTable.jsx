import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import api from '../../lib/api'

// const listings = [
//   {
//     id: "1", 
//     name: 'ABC Housing Ltd',
//     description: 'Spacious rooms with room service, wifi and cleaning',
//     price: '20,000',
//     gender: 'Male',
//   },
//   {
//     id: "2", 
//     name: 'Ganga Niwas',
//     description: 'Spacious rooms with room service, wifi and cleaning',
//     price: '50,000',
//     gender: 'Female',
//   },
//   {
//     id: '3', 
//     name: 'Test 123 society',
//     description: 'Spacious rooms with room service, wifi and cleaning',
//     price: '30,000',
//     gender: 'Male',
//   }
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const router = useRouter(); 
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [listings, setListings] = useState([]); 

  useEffect(() => {
    fetchListings(); 
  }, []);

  useLayoutEffect(() => {
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < listings.length
    setChecked(selectedItems.length === listings.length && listings.length !== 0)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedItems])

  const fetchListings = async () => { 
    const listings = await api.getAllListings(); 
    console.log(listings);
    setListings(listings); 
  } 

  function toggleAll() {
    setSelectedItems(checked || indeterminate ? [] : listings)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
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
            onClick={() => router.push('/create-listing')}
          >
            Add Listing
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {selectedItems.length > 0 && (
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
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                      Listing Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price 
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Gender
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {listings.length > 0 && listings.map((listing) => (
                    <tr key={listing.id} className={selectedItems.includes(listing) ? 'bg-gray-50' : undefined}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedItems.includes(listing) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={listing.id}
                          checked={selectedItems.includes(listing)}
                          onChange={(e) =>
                            setSelectedItems(
                              e.target.checked
                                ? [...selectedItems, listing]
                                : selectedItems.filter((p) => p !== listing)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedItems.includes(listing) ? 'text-indigo-600' : 'text-gray-900'
                        )}
                      >
                        {listing.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.price}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{listing.gender}</td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2">
                          Edit<span className="sr-only">, {listing.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}