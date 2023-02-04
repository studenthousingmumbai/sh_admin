import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'; 
import Layout from '../../../../components/common/Layout'; 
import Modal from '../../../../components/common/Modal'; 
import useApi from '../../../../hooks/useApi';

export default function AddFloors() {
    const [open, setOpen] = useState(false);
    const [floorNumber, setFloorNumber] = useState(0); 
    const router = useRouter(); 
    const { isReady } = router; 
    const { listing_id } = router.query; 
    const [listingName, setListingName] = useState(""); 
    const [floors, setFloors] = useState([]); 
    const { getListing, addFloor } = useApi();

    const fetchListing = async () => { 
      const listing = await getListing(listing_id); 

      console.log("listing retrieved: ", listing);
      console.log("listing floors: ", listing.floors);

      setListingName(listing.name); 
      setFloors(listing.floors); 
    }

    useEffect(() => { 
      if(isReady){
          console.log("listing id: ", listing_id); 
          fetchListing();
      }
    }, [isReady]); 

    const handleAddFloor = async (e) => { 
      e.preventDefault(); 

      // send request to create a new floor 
      setFloorNumber(0); 

      const add_floor_response = await addFloor(listing_id, floorNumber); 
      console.log(add_floor_response);
      await fetchListing()
    }

    return (
      <Layout>
        <div className='flex align-center mb-5 border-b pb-3  border-gray-300'> 
          <button
            type="button"
            className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => router.push(`/listing/${listing_id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className='text-xl font-medium leading-6 text-gray-900 mt-0.5'>{listingName}</h3>
        </div>


        <div className='grid grid-cols-4 mb-3 gap-4'> 
          <div 
            className='rounded-md border border-gray-500 bg-gray-200 flex justify-center items-center h-[50px] hover:bg-gray-100 cursor-pointer' 
            onClick={() => setOpen(true)}
          > 
            Add Floor + 
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'> 
          {floors && floors.map((floor,floor_index) => ( 
            <div className='rounded-md bg-white shadow-sm border border-gray-500 bg-white-200 p-3'> 
              <div className='w-full flex justify-between'> 
                <p className='font-semibold'>Floor {floor.floor_number}</p>
              </div>
              <div className="w-full flex justify-between">
                {/* <p>Created on: {new Date().toDateString(floor.created_at)}</p> */}
                <a className='text-blue-300 hover:text-blue-400 cursor-pointer' onClick={() => router.push(`/listing/${listing_id}/floors/${floor.floor_number}`)}>Edit floor</a>
              </div>
            </div>
          ))}
        </div>

        <Modal open={open} onClose={() => setOpen(false)} setOpen={setOpen} title="Add a floor">
          <div>
            <form onSubmit={handleAddFloor}>
              <input 
                type='number' 
                value={floorNumber} 
                onChange={e => setFloorNumber(e.target.value)} 
                className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                onClick={() => setOpen(false)}
              > 
                Add floor
              </button>
            </form>
          </div>
        </Modal>
      </Layout>
    )
}
