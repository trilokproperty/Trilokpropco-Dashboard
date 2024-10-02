import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [newPartner, setNewPartner] = useState({ name: '', image: null }); // Change to a single image
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await axios.get(`${endPoint}/partner`);
            setPartners(response.data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };

    const handleImageChange = (e) => {
        // Only set the first selected file
        setNewPartner(prevState => ({
            ...prevState,
            image: e.target.files[0] // Change to single image
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPartner(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', newPartner.name); // Append name
        
        // Append the single image to FormData
        if (newPartner.image) {
            formData.append('image', newPartner.image); // Change to 'image'
        }

        try {
            const response = await axios.post(`${endPoint}/partner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPartners([...partners, response.data]);
            setNewPartner({ name: '', image: null }); // Reset to empty values
            setLoading(false);
            toast.success("Partner successfully added!", { position: "top-center" });
        } catch (error) {
            console.error('Error adding partner:', error);
            setLoading(false);
            toast.error("Failed to add partner. Please try again.", { position: "top-center" });
        }
    };

    const deletePartner = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Partner?");
        if (!confirmDelete) return;
        try {
            setLoading(true);
            // Delete partner from database
            await axios.delete(`${endPoint}/partner/${id}`);
            setPartners(partners.filter(partner => partner._id !== id));
            setLoading(false);
            toast.success("Partner successfully deleted!", { position: "top-center" });
        } catch (error) {
            setLoading(false);
            console.error('Error deleting partner:', error);
            toast.error("Failed to delete partner. Please try again.", { position: "top-center" });
        }
    };

    return (
        <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden pb-10">
            <ToastContainer />
            {loading && (
                <div className="bg-[#0000003e] absolute w-full h-full z-10 py-36 px-10 flex justify-center items-center">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex gap-5">Loading... 
                            <span className="loading loading-ring loading-lg"></span>
                        </h3>
                        <p className="py-4">Please wait until it loads.</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Partner Name
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        value={newPartner.name} 
                        onChange={handleInputChange} 
                        placeholder="Partner Name" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Upload Image
                    </label>
                    <input 
                        type="file" 
                        onChange={handleImageChange} // Changed to only one image
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        required 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Partner
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {partners.map(partner => (
                    <div key={partner._id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-xl font-bold mb-2">{partner.name}</h2>
                        <div className="flex flex-wrap gap-2">
                            {partner.images && partner.images.length > 0 && (
                                <img 
                                    src={partner.images[0].url} // Display only the first image
                                    alt={partner.name} 
                                    className="w-24 h-24 object-cover rounded" 
                                />
                            )}
                        </div>
                        <button 
                            onClick={() => deletePartner(partner._id)} 
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Partners;
