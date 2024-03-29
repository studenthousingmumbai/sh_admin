import axios from 'axios';

export default function useApi() {
    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL 
    const admin_key = process.env.NEXT_PUBLIC_ADMIN_KEY

    const isAuthenticated = async (token) => { 
        try{ 
            // send the token to backend and verify validity 
            const response = await axios(base_url + '/user/current-user', { 
                method: "GET", 
                headers: { 
                    'authorization': `bearer ${token}`
                }
            });

            return response.data; 
        }
        catch(err){
            return err.response.data;
        }
    }

    const signup = async (firstname, lastname, email, password) => { 
        try{ 
            const response = await axios(base_url + '/signup', { 
                method: "POST", 
                data: { firstname, lastname, email, password }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const adminSignup = async (firstname, lastname, email, password, role) => { 
        try{ 
            const response = await axios(base_url + '/user/signup', { 
                method: "POST", 
                headers: { 
                    "admin-api-key": admin_key
                },
                data: { firstname, lastname, email, password, role }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const getUser = async (user_id) => { 
        try{ 
            const response = await axios.get(base_url + `/user/${user_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const updateUser = async (data) => { 
        try{ 
            const response = await axios(base_url + `/user`, { 
                method: "PATCH", 
                data
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const signin = async (email, password) => { 
        try{ 
            const response = await axios(base_url + '/user/login ', { 
                method: "POST", 
                headers: { 
                    "admin-api-key": admin_key
                },
                data: { email, password }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const googleSignin = async (token) => { 
        try{ 
            const response = await axios(base_url + '/user/google-signin', { 
                method: "POST", 
                data: { token }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }
    
    const getUsers = async (data) => { 
        try{ 
            const response = await axios(base_url + '/user/all', { 
                method: "POST", 
                data
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const createListing = async (formData) => { 
        try{ 
            const response = await axios.post(base_url + "/listing", formData); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const getListing = async (listing_id) => { 
        try{ 
            const response = await axios(base_url + `/listing/${listing_id}`, { method: "GET" }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        } 
    }

    const getAllListings = async (data) => { 
        try{ 
            const response = await axios(base_url + '/listing/all', { 
                method: "POST", 
                data
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        } 
    }

    const updateListing = async (formData) => { 
        try{ 
            const response = await axios.patch(base_url + '/listing', formData); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const addFloor = async (listing_id, floor_number) => { 
         try{ 
            const response = await axios(base_url + '/listing/create-floor', { 
                method: "POST", 
                data: { id: listing_id, floor_number }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const addAppartment = async (listing_id, floor_number, appartment_number) => { 
         try{ 
            const response = await axios(base_url + '/listing/create-appartment', { 
                method: "POST", 
                data: { 
                    listing_id, 
                    floor_number,
                    appartment_number
                }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const updateAppartment = async (formData) => { 
         try{ 
            const response = await axios.patch(base_url + '/listing/update-appartment', formData); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const availableBeds = async (listing_id) => { 
         try{ 
            const response = await axios(base_url + '/stats/available-beds', { 
                method: "POST", 
                data: { listing_id }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const studentsInAppartment = async (listing_id, appartment_id) => { 
         try{ 
            const response = await axios(base_url + '/stats/students-in-appartment', { 
                method: "POST", 
                data: { listing_id, appartment_id }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const studentsOnFloor = async (listing_id) => { 
         try{ 
            const response = await axios(base_url + '/stats/students-on-floor', { 
                method: "POST", 
                data: { listing_id }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const getBeds = async (appartment_id) => { 
        try{ 
            const response = await axios.get(base_url + `/listing/get-beds/${appartment_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const getBed = async (bed_id) => { 
        try{ 
            const response = await axios.get(base_url + `/listing/beds/${bed_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const createBed = async (data) => {
        try{ 
            const response = await axios(base_url + `/listing/beds/create`, { 
                method: "POST", 
                data
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const updateBed = async (bed_id, data) => {
        try{ 
            const response = await axios(base_url + `/listing/beds/${bed_id}`, { 
                method: "PATCH", 
                data
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const deleteBed = async  (bed_id) => {
        try{ 
            const response = await axios.delete(base_url + `/listing/beds/${bed_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    } 

    const getOrders = async (data) => { 
        try{ 
            const response = await axios(base_url + `/order/all`, { 
                method: "POST", 
                data 
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    const unlockBed = async ({order_id, adminKey}) => { 
        try{ 
            const response = await axios(base_url + `/order/unlock-bed`, { 
                method: "POST", 
                data: { order_id, adminKey } 
            }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }

    return { 
        getOrders, 
        addAppartment, 
        addFloor,
        adminSignup,
        availableBeds, 
        createBed, 
        createListing, 
        deleteBed, 
        getAllListings, 
        getBed, 
        getBeds, 
        getListing, 
        getUser, 
        getUsers, 
        googleSignin, 
        isAuthenticated, 
        signin, 
        signup, 
        studentsInAppartment, 
        studentsOnFloor, 
        updateAppartment, 
        updateBed, 
        updateListing, 
        updateUser,
        unlockBed
    }
}