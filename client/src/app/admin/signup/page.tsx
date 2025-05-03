'use client'

import { registerUserUrl } from "@/data/urls";
import { useRouter } from "next/navigation";

import { useState } from "react";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const router = useRouter()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('passwords do not match')
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
             await fetch(registerUserUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            }) .then((response) => response.json()) // Convert response to JSON
            .then(() => router.push(`/admin/dashboard`)
        ) // Log the data
            .catch((error) => console.error("Error:", error)); ;

         
            
        } catch (err) {
            console.error(err)
            setError('an error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod shadow-md"
            >
                <div className="mb-4 text-center">
                    <h2 className="text-black text-xl font-bold">SIGN UP</h2>
                </div>

                    <>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="text"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="text-black mt-1 block w-full  text-black rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-goldenrod text-black py-2 px-4 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </>
                
            </form>
        </div>
    );
};

export default SignupForm;
