import axios from 'axios'; 

const base_url = 'http://localhost:8000'; 

export default { 
    isAuthenticated: async (token) => { 
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
    }, 

    signup: async (firstname, lastname, email, password) => { 
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
    }, 

    adminSignup: async (firstname, lastname, email, password, role) => { 
        try{ 
            const response = await axios(base_url + '/user/signup', { 
                method: "POST", 
                headers: { 
                    "admin-api-key": "2e80dc67-cfc5-4429-a867-a485db42fb7e"
                },
                data: { firstname, lastname, email, password, role }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    },

    getUser: async (user_id) => { 
        try{ 
            const response = await axios.get(base_url + `/user/${user_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    updateUser: async (data) => { 
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
    }, 

    signin: async (email, password) => { 
        try{ 
            const response = await axios(base_url + '/user/login ', { 
                method: "POST", 
                headers: { 
                    "admin-api-key": "2e80dc67-cfc5-4429-a867-a485db42fb7e"
                },
                data: { email, password }
            }); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    googleSignin: async (token) => { 
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
    }, 


    getUsers: async (data) => { 
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
    }, 

    createListing: async (formData) => { 
        try{ 
            const response = await axios.post("http://localhost:8000/listing", formData); 

            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    getListing: async (listing_id) => { 
        try{ 
            const response = await axios(base_url + `/listing/${listing_id}`, { method: "GET" }); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        } 
    }, 

    getAllListings: async (data) => { 
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
    }, 

    updateListing: async (formData) => { 
        try{ 
            const response = await axios.patch(base_url + '/listing', formData); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    addFloor: async (listing_id, floor_number) => { 
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
    }, 

    addAppartment: async (listing_id, floor_number, appartment_number) => { 
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
    }, 

    updateAppartment: async (formData) => { 
         try{ 
            const response = await axios.patch(base_url + '/listing/update-appartment', formData); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    availableBeds: async (listing_id) => { 
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
    }, 

    studentsInAppartment: async (listing_id, appartment_id) => { 
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
    }, 

    studentsOnFloor: async (listing_id) => { 
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
    }, 

    getBeds: async (appartment_id) => { 
        try{ 
            const response = await axios.get(base_url + `/listing/get-beds/${appartment_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    getBed: async (bed_id) => { 
        try{ 
            const response = await axios.get(base_url + `/listing/beds/${bed_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    }, 

    createBed: async (data) => {
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
    }, 

    updateBed: async (bed_id, data) => {
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
    }, 

    deleteBed: async  (bed_id) => {
        try{ 
            const response = await axios.delete(base_url + `/listing/beds/${bed_id}`); 
            return response.data; 
        }
        catch(err){ 
            console.log(err); 
            return err.response.data; 
        }
    } 
}