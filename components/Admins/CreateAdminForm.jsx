import { useState } from 'react';
import MultiUpload from '../common/MultiUpload/MultiUpload';
import DynamicForm from '../common/DynamicList';
import { field_types, field_variants } from '../../constants';
import { useRouter } from 'next/router';
import api from '../../lib/api';

const fields = {
  name: {
    type: field_types.TEXT,
    variant: field_variants[field_types.TEXT].text,
    label: "Name",
    name: "name",
    placeholder: "Enter Amenity Name",
    required: true,
  },
  description: {
    type: field_types.TEXT,
    variant: field_variants[field_types.TEXT].text,
    label: "Description",
    name: "description",
    placeholder: "Enter a short description",
    required: true,
  },
  images: { 
    type: field_types.FILES, 
    variant: null,
    label: "Property Images", 
    name: 'images', 
    required: false
  }
};

const layout = [ 
  ['name', 'description'], 
  ['images']
]

const values = [
  // {
  //   name: "Swimming Pool",
  //   description: "A large olympic size swimming pool"
  // },
  // {
  //   name: "Gym",
  //   description: "24 hour gym with the top equipment"
  // },
  // {
  //   name: "Clubhouse",
  //   description: "Clubhouse for leisure activites"
  // },
]


const genderOptions = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' }
]; 


export default function Example() {
  const router = useRouter(); 
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(""); 
  const [walkthroughUrl, setWalkthroughUrl] = useState(""); 
  const [price, setPrice] = useState(""); 
  const [floorPlan, setFloorPlan] = useState(null); 
  const [images, setImages] = useState([]); 
  const [amenities, setAmenities] = useState([]); 
  const [gender, setGender] = useState(''); 

  const handleSubmit =  async (e) => { 
    e.preventDefault(); 

    // send create listing request here 
    try{ 
      const formData = new FormData(); 

      formData.append('name', name); 
      formData.append('description', description); 
      formData.append('address', address);
      formData.append('price', price); 
      formData.append('gender', gender); 
      formData.append('walkthrough_url', walkthroughUrl); 
      formData.append('floor_plan', floorPlan[0].file); 
      formData.append('amenities', JSON.stringify(amenities.map(amenity => ({ name: amenity.name, description: amenity.description, total_images: amenity.images.length })))); 

      for(let image of images) {
        formData.append('images', image.file); 
      }

      let amenity_images = []; 

      for(let i = 0; i < amenities.length; i++){ 
        amenity_images = [
          ...amenity_images, 
          ...amenities[i].images, 
        ]
      }

      console.log("Amenity images: ", amenity_images); 

      for(let amenity of amenity_images){
        console.log("Amenity: ", amenity); 
        formData.append('amenities_images', amenity.file); 
      }

      // console.log("Name: ", name); 
      // console.log("description: ", description); 
      // console.log("Address: ", address); 
      // console.log("Price: ", price); 
      // console.log("walkthrough_url", walkthroughUrl);
      // console.log("Amenities: ", amenities.map(amenity => ({ name: amenity.name, description: amenity.description }))); 
      // console.log("Images :", images); 
      // console.log("Gender: ", gender); 

      const response = await api.createListing(formData); 
      console.log(response); 
    } 
    catch(err) { 
      console.log("error: ", err); 
    }

    resetForm(); 
    router.push('/listings');
  }

  const resetForm = () => { 
    // reset form state 
    setName(""); 
    setDescription(""); 
    setAddress(""); 
    setPrice(""); 
    setImages([]); 
    setFloorPlan(null); 
    setAmenities([]); 
    setGender(''); 
  }

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <div className='flex align-center'> 
              <button
                type="button"
                className="mr-2 text-gray-500 hover:text-gray-600 inline-flex items-center rounded-full border border-transparent bg-gray-100 p-1.5 text-white shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                onClick={() => router.push('/listings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <h3 className="text-xl font-medium leading-6 text-gray-900 mt-0.5">Listing</h3>
            </div>
            <p className="mt-1 max-w-2xl text-md text-gray-500">
              This will be dislayed as a property listing to end users.
            </p>
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
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={''}
                />
                <p className="mt-2 text-sm text-gray-500">Full property address with zip code</p>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Walkthrough Url
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <div className="flex max-w-lg rounded-md shadow-sm">
                        {/* <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        workcation.com/
                        </span> */}
                        <input
                            type="text"
                            value={walkthroughUrl}
                            onChange={e => setWalkthroughUrl(e.target.value)}
                            //   placeholder="Enter Listing Name"
                            autoComplete="username"
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Floor Plan
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <MultiUpload onChange={(files) => setFloorPlan(files)}/>
              </div>
            </div>       

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Property Images
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <MultiUpload onChange={(files) => setImages(files)}/>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Amenities
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <DynamicForm fields={fields} layout={layout} values={values} onChange={(state) => setAmenities(state)}/>
              </div>
            </div>
          </div>
      </div>
      </div>
      
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
  )
}