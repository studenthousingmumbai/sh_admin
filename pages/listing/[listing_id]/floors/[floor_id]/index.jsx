import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'; 
import Layout from '../../../../../components/common/Layout'; 
import Modal from '../../../../../components/common/Modal'; 
import useApi from '../../../../../hooks/useApi';

export default function AddFloors() {
    const [open, setOpen] = useState(false);
    const [appartmentNumber, setAppartmentNumber] = useState(""); 
    const [appartments, setAppartments] = useState([]);
    const router = useRouter(); 
    const { isReady } = router; 
    const { listing_id, floor_id: floorNumber } = router.query; 
    const [listingName, setListingName] = useState(""); 
    const { getListing, addAppartment } = useApi()

    const fetchListing = async () => { 
      const listing = await getListing(listing_id); 

      console.log("listing retrieved: ", listing);
      console.log("listing floors: ", listing.floors);

      const target_floor = listing.floors.find(floor => floor.floor_number === floorNumber); 
      
      setAppartments(target_floor.appartments); 
      setListingName(listing.name); 
    }

    useEffect(() => { 
      if(isReady){
          console.log("listing id: ", listing_id); 
          fetchListing();
      }
    }, [isReady]); 

    const handleAddAppartment = async (e) => { 
      e.preventDefault(); 

      // send request to create a new floor 
      setAppartmentNumber(""); 

      const add_appartment_response = await addAppartment(listing_id, floorNumber, appartmentNumber); 
      console.log(add_appartment_response);
      await fetchListing()
    }

    return (
      <Layout>
        <div className='flex align-center mb-5 border-b pb-3  border-gray-300'> 
          <button
            type="button"
            className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => router.push(`/listing/${listing_id}/floors`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className='text-xl font-medium leading-6 text-gray-900 mt-0.5'>{listingName} - Floor {floorNumber}</h3>
        </div>
        
        {/* <h2 className='text-xl font-semibold mb-5'>Add Appartment to Floor</h2> */}

        <div className='grid grid-cols-4 mb-3 gap-4'> 
          <div 
            className='rounded-md border border-gray-500 bg-gray-200 flex justify-center items-center h-[50px] hover:bg-gray-100 cursor-pointer' 
            onClick={() => setOpen(true)}
          > 
            Add Appartment + 
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'> 
          {appartments.map((appartment,appartment_index) => ( 
            <div className='rounded-md bg-white shadow-sm border border-gray-500 bg-white-200 p-3'> 
              <div className='w-full flex justify-between'> 
                <p className='font-semibold'>Appartment {appartment.appartment_number}</p>
                {/* <a className='text-blue-300 hover:text-blue-400 cursor-pointer' onClick={() => {}}>Edit appartment number</a> */}
              </div>
              <div className="w-full flex justify-between">
                <p>Created on: {new Date().toDateString(appartment.created_at)}</p>
                <a className='text-blue-300 hover:text-blue-400 cursor-pointer' onClick={() => router.push(`/listing/${listing_id}/floors/${floorNumber}/${appartment.id}`)}>Edit appartment</a>
              </div>
            </div>
          ))}
        </div>

        <Modal open={open} setOpen={setOpen} onClose={() => setOpen(false)} title="Add an appartment">
          <div>
            <form onSubmit={handleAddAppartment}>
              <input 
                type='number' 
                placeholder='apartment no'
                value={appartmentNumber} 
                onChange={e => setAppartmentNumber(e.target.value)} 
                className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                onClick={() => setOpen(false)}
              > 
                Add appartment
              </button>
            </form>
          </div>
        </Modal>
      </Layout>
    )
}