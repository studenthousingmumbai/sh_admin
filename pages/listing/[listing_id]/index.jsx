import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'; 
import Head from 'next/head'
import Layout from '../../../components/common/Layout';
import api from '../../../lib/api';
import MultiUpload from '../../../components/common/MultiUpload/MultiUpload'; 
import DynamicForm from '../../../components/common/DynamicList'; 
import Tabs from '../../../components/common/Tabs';
import { field_types, field_variants } from '../../../constants';
import useApi from '../../../hooks/useApi';
import Errors from '../../../components/common/Errors';

const fields = {
    name: {
      type: field_types.TEXT,
      variant: field_variants[field_types.TEXT].text,
      label: "Name",
      name: "name",
      placeholder: "Enter Amenity Name",
      required: true,
    }
};
  
const layout = [ 
    ['name'], 
]
 
const genderOptions = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' }
]; 

export default function index() {
    const router = useRouter(); 
    const { isReady } = router; 
    const { listing_id } = router.query; 
    const [name, setName] = useState(""); 
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState(""); 
    const [price, setPrice] = useState(""); 
    const [images, setImages] = useState([]); 
    const [amenities, setAmenities] = useState([]); 
    const [gender, setGender] = useState(''); 
    const [existingImages, setExistingImages] = useState([]); 
    const [line_1, setLine1] = useState(""); 
    const [line_2, setLine2] = useState(""); 
    const [city, setCity] = useState(""); 
    const [state, setState] = useState(""); 
    const [zip, setZip] = useState(""); 
    const [errors, setErrors] = useState([]);
    const [videoLink, setVideoLink] = useState("");
    const { getListing, updateListing } = useApi();
 
    const fetchListing = async () => { 
        const listing = await getListing(listing_id); 

        console.log("listing retrieved: ", listing);

        setName(listing.name); 
        setDescription(listing.description); 
        setLine1(listing.address.line_1);
        setLine2(listing.address.line_2); 
        setCity(listing.address.city); 
        setState(listing.address.state); 
        setZip(listing.address.zip); 
        setPrice(parseInt(listing.price));
        setVideoLink(listing.video_link);
        setAmenities(listing.amenities.map(amenity => ({ name: amenity }))); 
        setGender(listing.gender); 
        setExistingImages(listing.images); 
    }

    useEffect(() => { 
        if(isReady){
            console.log("listing id: ", listing_id); 
            fetchListing(listing_id); 
        }
    }, [isReady]); 

    const handleSubmit =  async (e) => { 
        e.preventDefault(); 
  
        const formData = new FormData(); 
        
        formData.append("id", listing_id); 
        formData.append('name', name); 
        formData.append('description', description); 
        formData.append('address', JSON.stringify({ line_1, line_2, city, state, zip }));
        formData.append('price', price); 
        formData.append('gender', gender); 
        formData.append('video_link', videoLink);
        formData.append('amenities', JSON.stringify(amenities.map(amenity => amenity.name))); 
        formData.append('existing_images', JSON.stringify(existingImages)); 

        if(images.length !== 0) {
            for(let image of images) {
                formData.append('images', image.file); 
            }
        }

        const response = await updateListing(formData); 
        
        if('errors' in response) { 
            setErrors(response.errors);
            return;
        }

        resetForm(); 
        router.push('/listing');
    }
  
    const resetForm = () => { 
      // reset form state 
      setName(""); 
      setDescription(""); 
      setAddress(""); 
      setPrice(""); 
      setImages([]); 
      setAmenities([]); 
      setGender(''); 
      setLine1(''); 
      setLine2(''); 
      setCity(''); 
      setState(''); 
      setZip(''); 
      setVideoLink("");
    }

    return (
        <>
            <Head>
                <title>Test Page</title>
                <meta name="description" content="Test page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <main>
                <Layout>
                    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
                        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                            <div className="space-y-6 sm:space-y-5">
                            <div>
                                <div className='flex justify-between align-center'> 
                                    <div className='flex align-center'> 
                                        <button
                                            type="button"
                                            className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                                            onClick={() => router.push('/listing')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-black">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>

                                        <h3 className="text-xl font-medium leading-6 text-gray-900 mt-0.5">Listing</h3>
                                    </div>

                                    {
                                        isReady && 
                                        <button
                                            type="button"
                                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => router.push(`/listing/${listing_id}/floors`)}
                                        >
                                            Add Floors
                                        </button>
                                    }
                                    
                                </div>
                                

                                {/* {
                                    isReady && 
                                    <Tabs 
                                        tabs={[
                                            { name: 'General', href: `/listing/${listing_id}`},
                                            { name: 'Floor Management', href: `/listing/${listing_id}/floors`},
                                        ]} 
                                        current={currentTab}
                                        setCurrent={setCurrentTab}
                                    />
                                } */}
                                
                                {/* <p className="mt-1 max-w-2xl text-md text-gray-500">
                                    This will be dislayed as a property listing to end users.
                                </p> */}
                            </div>

                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Listing Name
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className="flex max-w-lg rounded-md shadow-sm">
                                        {/* <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                            workcation.com/
                                        </span> */}
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        //   placeholder="Enter Listing Name"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        About
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <textarea
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            rows={3}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            defaultValue={''}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Write a few sentences about the property</p>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Address
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className='flex mb-3'>
                                        <input
                                            type="text"
                                            value={line_1}
                                            onChange={e => setLine1(e.target.value)}
                                            placeholder="Address line 1"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={line_2}
                                            onChange={e => setLine2(e.target.value)}
                                            placeholder="Address line 2"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        </div>
                                        <div className='flex mb-3'>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            placeholder="City"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                            placeholder="State"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={zip}
                                            onChange={e => setZip(e.target.value)}
                                            placeholder="Zip code"
                                            autoComplete="username"
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Price
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className="flex max-w-lg rounded-md shadow-sm">
                                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={e => setPrice(e.target.value.toString())}
                                                //   placeholder="Enter Listing Name"
                                                autoComplete="username"
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Gender
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <div>
                                    {/* <label className="text-base font-medium text-gray-900">Select Gender</label>
                                    <p className="text-sm leading-5 text-gray-500">Is this listing for males or females? </p> */}
                                    <fieldset className="mt-4">
                                        <legend className="sr-only">Gender Selction</legend>
                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                        {genderOptions.map((option) => (
                                            <div key={option.id} className="flex items-center">
                                            <input
                                                id={option.id}
                                                name="notification-method"
                                                type="radio"
                                                value={option.id}
                                                checked={gender === option.id}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={e => setGender(e.target.value)}
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

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Listing Video
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className="flex max-w-lg rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                value={videoLink}
                                                onChange={e => setVideoLink(e.target.value)}
                                                autoComplete="username"
                                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                                
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Property Images
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <MultiUpload onChange={(files) => setImages(files)} existingImages={existingImages} setExistingImages={setExistingImages}/>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Amenities
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <DynamicForm fields={fields} layout={layout} values={amenities} onChange={(state) => setAmenities(state)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        {
                            errors.length > 0 && 
                            <Errors errors={errors}/>
                        }
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
    )
}