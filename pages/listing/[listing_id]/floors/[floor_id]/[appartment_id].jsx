import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../../../../components/common/Layout'; 
import MultiUpload from '../../../../../components/common/MultiUpload/MultiUpload';
import BedMarkingTool from '../../../../../components/Listings/BedMarkingTool';
import Modal from '../../../../../components/common/Modal';
import api from '../../../../../lib/api';
import { TrashIcon } from '@heroicons/react/20/solid'
import useApi from '../../../../../hooks/useApi';

export default function EditAppartment() {
    const router = useRouter(); 
    const { isReady } = router; 
    const { listing_id, floor_id: floorNumber, appartment_id } = router.query; 
    const [walkthroughUrl, setWalkthroughUrl] = useState(""); 
    const [open, setOpen] = useState(false); 
    const [roomNumber, setRoomNumber] = useState(null); 
    const [floorPlan, setFloorPlan] = useState(null); 
    const [floorPlanUrl, setFloorPlanUrl] = useState("");
    const [boxes, setBoxes] = useState([]); 
    const [beds, setBeds] = useState([]);
    const [listingName, setListingName] = useState(""); 
    const [appartmentNo, setAppartmentNo] = useState('');
    const [currentBbox, setCurrentBbox] = useState(null); 
    const { createBed: create_bed, getListing, getBeds, updateAppartment } = useApi();

    async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
        console.log(url);
        const response = await fetch(url);
        const data = await response.blob();

        return new File([data], name, {
            type: data.type || defaultType,
        });
    }

    const createBed = async (e) => { 
        e.preventDefault(); 

        const create_bed_res = await create_bed({ 
            appartment_id, 
            bbox: currentBbox, 
            room_no: roomNumber 
        }); 

        setBoxes([
            ...boxes, 
            {
                ...currentBbox, 
                room_no: roomNumber, 
                id: create_bed_res.id
            }, 
        ]); 

        // setBoxes([...boxes, { }])

        console.log("Create bed response: ", create_bed_res); 
    }


    const fetchListing = async () => { 
        const listing = await getListing(listing_id); 
  
        console.log("listing retrieved: ", listing);
        console.log("listing floors: ", listing.floors);
  
        const target_floor = listing.floors.find(floor => floor.floor_number === floorNumber); 
        const target_appartment = target_floor.appartments.find(appartment => appartment.id === appartment_id);

        console.log("Found target appartment: ", target_appartment); 

        // fetch all the beds for the appartment here 
        const all_beds = await getBeds(appartment_id); 
        console.log("All beds: ", all_beds); 

        if(all_beds.length > 0) { 
            setBeds(all_beds);
            setBoxes(all_beds.map(bed => ({ 
                id: bed.id, 
                ...bed.bounding_box, 
                room_no: bed.room_no
            }))); 
        } 

        if(target_appartment) {
            setAppartmentNo(target_appartment.appartment_number); 

            target_appartment.walkthrough_url && setWalkthroughUrl(target_appartment.walkthrough_url); 

            if(target_appartment.floor_plan) { 
                setFloorPlanUrl(target_appartment.floor_plan);
                const floor_plan_file = await getFileFromUrl(target_appartment.floor_plan, 'floor_plan'); 
                setFloorPlan(floor_plan_file);
            }
        }

        setListingName(listing.name); 
    }

    useEffect(() => { 
        if(isReady){
            console.log("listing id: ", listing_id); 
            console.log("appartment id: ", appartment_id); 
            fetchListing();
        }
    }, [isReady]); 

    const removeBed = (index) => { 
        const all_beds = [...boxes]; 
        
        if(index === undefined) return; 

        if(index <= all_beds.length) {
            all_beds.splice(index, 1);
            setBoxes(all_beds);  
        }
    }

    const saveAppartmentDetails = async () => { 
        // create form data with encoded data here 
        const formData = new FormData(); 

        console.log(appartment_id);
        console.log(boxes);
        console.log(walkthroughUrl);
        console.log(floorPlan);

        formData.append('appartment_id', appartment_id); 
        // formData.append('beds', JSON.stringify(boxes)); 
        formData.append('walkthrough_url', walkthroughUrl); 
        !floorPlanUrl && formData.append('floor_plan', floorPlan); 
        // send api request with form data to update appartment details 

        const save_appartment_response = await updateAppartment(formData);
        console.log(save_appartment_response); 
        
        setBoxes([]); 
        setFloorPlan(null)
        setWalkthroughUrl(""); 

        router.push(`/listing/${listing_id}/floors/${floorNumber}`); 
    }

    const handleModalClose = (args) => {
        console.log("handle close args: ", args);  
        setOpen(false); 

        // clear the current bbox from the list of boxes 
        const all_boxes = [...boxes]; 
        const target_box_index = all_boxes.findIndex(box => JSON.stringify(box) === JSON.stringify(currentBbox)); 

        all_boxes.splice(target_box_index, 1); 
        setBoxes(all_boxes); 
    }

    return (
        <Layout>
            <div className='flex align-center mb-5 border-b pb-3  border-gray-300'> 
                <button
                    type="button"
                    className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    onClick={() => router.push(`/listing/${listing_id}/floors/${floorNumber}`)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h3 className='text-xl font-medium leading-6 text-gray-900 mt-0.5'>{listingName} - Floor {floorNumber} - Appartment {appartmentNo}</h3>
            </div>

            {/* <h2 className='text-xl font-semibold mb-5'>Add beds to the apparment</h2> */}
            {
                !floorPlanUrl && !floorPlan &&  
                <MultiUpload onChange={(change) => setFloorPlan(change[0].file)}/>
            }   
            
            { 
                floorPlan !== null && 
                <div className='flex mb-3'>
                    <div className='w-full h-[70vh] bg-gray-200 border border-gray-300 mr-3 overflow-auto p-3'>
                        {/* <canvas className="w-full h-[80vh] bg-red-100 rounded-md"></canvas> */}
                        <BedMarkingTool 
                            image_file={floorPlan} 
                            boxes={boxes} 
                            setBoxes={setBoxes} 
                            setOpen={setOpen} 
                            setCurrentBbox={setCurrentBbox}
                        />
                    </div>  
                    <div className="w-[350px]  h-[70vh] bg-gray-200 border border-gray-300 p-3 overflow-auto">
                        <h1>Added Beds</h1>
                        {
                            boxes && boxes.map((box,bed_index) => ( 
                                box.id && 
                                <div className='bg-white rounded-sm mb-3 p-3 flex justify-between items-center'>
                                    Bed {bed_index + 1} <br/>
                                    Room No: {box.room_no}
                                    <TrashIcon className='text-gray-300 hover:text-red-500 w-5 h-5 cursor-pointer' onClick={() => removeBed(bed_index)}/>
                                </div>
                            ))
                        }
                    </div>
                </div> 
            }

            <input 
                type='text'  
                value={walkthroughUrl}
                placeholder='Walkthrough Url'
                className='block min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                onChange={e => setWalkthroughUrl(e.target.value)}
            />

            <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={saveAppartmentDetails}
            >
                Save
            </button>

            <Modal open={open} setOpen={setOpen} onClose={handleModalClose} title="Add Room Number">
                <form onSubmit={createBed}>
                    <input 
                        type='number' 
                        placeholder='Enter Room Number'
                        value={roomNumber} 
                        onChange={e => setRoomNumber(e.target.value)} 
                        className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3'
                    />
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={() => setOpen(false)}
                    > 
                        Save Bed
                    </button>
                </form>
            </Modal>
        </Layout>
    )
}
