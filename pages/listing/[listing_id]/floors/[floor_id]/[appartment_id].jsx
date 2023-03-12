import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../../../../components/common/Layout'; 
import MultiUpload from '../../../../../components/common/MultiUpload/MultiUpload';
import BedMarkingTool from '../../../../../components/Listings/BedMarkingTool';
import Modal from '../../../../../components/common/Modal';
import api from '../../../../../lib/api';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import useApi from '../../../../../hooks/useApi';
import Errors from '../../../../../components/common/Errors';

export default function EditAppartment() {
    const router = useRouter(); 
    const { isReady } = router; 
    const { listing_id, floor_id: floorNumber, appartment_id } = router.query; 
    const [walkthroughUrl, setWalkthroughUrl] = useState(""); 
    const [open, setOpen] = useState(false); 
    const [editFloorPlanOpen, setEditFloorPlanOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editBed, setEditBed] = useState("");
    const [errors, setErrors] = useState([]); 
    const [roomNumber, setRoomNumber] = useState(null); 
    const [bedNumber, setBedNumber] = useState(null); 
    const [floorPlan, setFloorPlan] = useState(null); 
    const [floorPlanUrl, setFloorPlanUrl] = useState("");
    const [boxes, setBoxes] = useState([]); 
    const [beds, setBeds] = useState([]);
    const [listingName, setListingName] = useState(""); 
    const [appartmentNo, setAppartmentNo] = useState('');
    const [currentBbox, setCurrentBbox] = useState(null); 
    const [focusedBed, setFocusedBed] = useState(null); 

    const { createBed: create_bed, getListing, getBeds, updateAppartment, deleteBed, updateBed } = useApi();

    async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
        console.log(url);
        const response = await fetch(url);
        const data = await response.blob();

        return new File([data], name, {
            type: data.type || defaultType,
        });
    }
 
    const createBed = async (e) => { 
        console.log("createBed called!");
        e.preventDefault(); 

        const create_bed_res = await create_bed({ 
            appartment_id, 
            bbox: currentBbox, 
            room_no: roomNumber, 
            bed_no: bedNumber
        }); 
        console.log("Create bed response: ", create_bed_res); 

        if('errors' in create_bed_res) { 
            setErrors(create_bed_res.errors);
            return; 
        }

        const all_boxes = [...boxes]; 
        const box_without_id = all_boxes.findIndex(box => !('id' in box)); 

        all_boxes[box_without_id].id = create_bed_res.id; 
        all_boxes[box_without_id].room_no = roomNumber; 
        all_boxes[box_without_id].bed_no = bedNumber; 

        setFocusedBed(null); 
        setBoxes(all_boxes); 
        setRoomNumber("");
        setBedNumber("");
        setOpen(false); 
    }

    const fetchListing = async () => { 
        const listing = await getListing(listing_id);   
        const target_floor = listing.floors.find(floor => floor.floor_number === floorNumber); 
        const target_appartment = target_floor.appartments.find(appartment => appartment.id === appartment_id);

        // fetch all the beds for the appartment here 
        const all_beds = await getBeds(appartment_id); 
        console.log("All beds: ", all_beds); 

        if(all_beds.length > 0) { 
            setBeds(all_beds);
            setBoxes(all_beds.map(bed => ({ 
                id: bed.id, 
                ...bed.bounding_box, 
                room_no: bed.room_no, 
                bed_no: bed.bed_no 
            }))); 
        } else { 
            setBeds([]); 
            setBoxes([]);
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

    const onFloorPlanChange = async (file) => { 
        // create form data with encoded data here 
        const formData = new FormData(); 

        formData.append('appartment_id', appartment_id); 
        !floorPlanUrl && formData.append('floor_plan', file); 

        // send api request with form data to update appartment details 
        await updateAppartment(formData);

        fetchListing();
    }

    const saveAppartmentDetails = async () => { 
        // create form data with encoded data here 
        const formData = new FormData(); 

        formData.append('appartment_id', appartment_id); 
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
        setOpen(false); 

        // clear the current bbox from the list of boxes 
        const all_boxes = [...boxes]; 
        const target_box_index = all_boxes.findIndex(box => JSON.stringify(box) === JSON.stringify(currentBbox)); 

        all_boxes.splice(target_box_index, 1); 
        setBoxes(all_boxes); 
    }

    const handleEditClose = () => { 
        setEditOpen(false);
        setRoomNumber("");
        setBedNumber("");
        setEditBed("");
    }

    const handleUpdateBed = async (e) => {
        e.preventDefault(); 

        const updateBedResponse  = await updateBed(
            editBed.id, 
            { 
                room_no: roomNumber, 
                bed_no: bedNumber 
            }
        ); 
        console.log("Update bed response: ", updateBedResponse); 

        if('errors' in updateBedResponse) { 
            setErrors(updateBedResponse.errors);
            return; 
        }    

        setRoomNumber("");
        setBedNumber("");
        setEditBed("");
        setEditOpen(false);
        fetchListing();
    }

    const handleBedDelete = async (bed_id) => { 
        await deleteBed(bed_id); 
        await fetchListing();
    }

    const handleUpdateFloorPlan = async () => { 
        // delete all previously added beds 
        for(let box of boxes) { 
            deleteBed(box.id); 
        }

        setBoxes([]); 
        setFloorPlan(null); 
        setFloorPlanUrl(""); 
        setEditFloorPlanOpen(false);
    }

    return (
        <Layout>
            <div className='flex align-center mb-5 border-b pb-3  border-gray-300'> 
                <button
                    type="button"
                    className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    onClick={() => router.push(`/listing/${listing_id}/floors/${floorNumber}`)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h3 className='text-xl font-medium leading-6 text-gray-900 mt-0.5'>{listingName} - Floor {floorNumber} - Appartment {appartmentNo}</h3>
            </div>

            { 
                floorPlan !== null && 
                <button
                    type="submit"
                    className="mb-3 inline-flex justify-center rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setEditFloorPlanOpen(true)}
                >
                    Update Floor plan
                </button>
            }

            {/* <h2 className='text-xl font-semibold mb-5'>Add beds to the apparment</h2> */}
            {
                !floorPlanUrl && !floorPlan &&  
                <div className='mb-3'>
                    <MultiUpload onChange={(change) => onFloorPlanChange(change[0].file)}/>
                </div>
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
                            focusedBed={focusedBed}
                            setFocusedBed={setFocusedBed}
                        />
                    </div>  
                    <div className="w-[350px]  h-[70vh] bg-gray-200 border border-gray-300 p-3 overflow-auto">
                        <h1 className='font-semibold text-2xl mb-3'>Added Beds</h1>
                        {
                            boxes && boxes.map((box,bed_index) => ( 
                                box.id && 
                                <button 
                                    type="button" 
                                    onFocus={() => setFocusedBed(box.id)} 
                                    onBlur={() => setFocusedBed("")} 
                                    className={'w-full bg-white rounded-sm mb-3 p-3 flex justify-between items-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' + `${focusedBed === box.id && ' ring-2 ring-indigo-500 ring-offset-2'}`}
                                >
                                    <div>
                                        <div>
                                            Room No: {box.room_no}
                                        </div>
                                        <div>   
                                            Bed No: {box.bed_no}
                                        </div>  
                                    </div>

                                    <div className='flex'>
                                        <TrashIcon className='mr-2 text-gray-300 hover:text-red-500 w-5 h-5 cursor-pointer' onClick={() => handleBedDelete(box.id)}/>
                                        <PencilSquareIcon className='text-gray-300 hover:text-blue-500 w-5 h-5 cursor-pointer' onClick={() => { setEditBed(box); setEditOpen(true); setBedNumber(box.bed_no); setRoomNumber(box.room_no) }}/>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                </div> 
            }

            <input 
                type='text'  
                value={walkthroughUrl}
                placeholder='Enter Walkthrough Url'
                className='block min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2'
                onChange={e => setWalkthroughUrl(e.target.value)}
            />
            <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={saveAppartmentDetails}
            >
                Save Changes
            </button>

            <Modal open={editFloorPlanOpen} setOpen={setEditFloorPlanOpen} onClose={setEditFloorPlanOpen} title="Update Floor Plan">
                <h1 className='font-normal mb-2 '>Are you sure you want to update the current floor plan? This will clear the current floor plan and delete all the previously marked beds.</h1>

                <div className='flex'>
                    <button
                        type="submit"
                        className="mr-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                        onClick={handleUpdateFloorPlan}
                    > 
                        Yes update
                    </button>
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-white py-2 px-4 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setEditFloorPlanOpen(false)}
                    > 
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal open={editOpen} setOpen={setEditOpen} onClose={handleEditClose} title="Update Bed Details">
                <form onSubmit={(e) => handleUpdateBed(e)}>
                    <input 
                        type='number' 
                        placeholder='Enter Room Number'
                        value={roomNumber}
                        onChange={e => setRoomNumber(e.target.value)} 
                        className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3'
                        required
                    />
                    <input 
                        type='text' 
                        placeholder='Enter Bed Number'
                        value={bedNumber}
                        onChange={e => setBedNumber(e.target.value)} 
                        className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3'
                        required
                    />
                    {
                        errors.length > 0 && 
                        <Errors errors={errors}/>
                    }
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    > 
                        Update Bed
                    </button>
                </form>
            </Modal>


            <Modal open={open} setOpen={setOpen} onClose={handleModalClose} title="Add Bed Details">
                <form onSubmit={createBed}>
                    <input 
                        type='number' 
                        placeholder='Enter Room Number'
                        value={roomNumber} 
                        onChange={e => setRoomNumber(e.target.value)} 
                        className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3'
                        required
                    />
                    <input 
                        type='text' 
                        placeholder='Enter Bed Number'
                        value={bedNumber} 
                        onChange={e => setBedNumber(e.target.value)} 
                        className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-3'
                        required
                    />
                    {
                        errors.length > 0 && 
                        <Errors errors={errors}/>
                    }
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    > 
                        Save Bed
                    </button>
                </form>
            </Modal>
        </Layout>
    )
}
