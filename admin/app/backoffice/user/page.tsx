'use client'

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import { Plus, Edit, Trash2, Check, UserPlus, Lock, User } from 'lucide-react';
import MyModal from "../components/MyModal";

// Custom Modal Component
const Modal = ({ 
    isOpen, 
    onClose, 
    children, 
    title 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    children: React.ReactNode, 
    title: string 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
                <div className="relative flex flex-col w-full bg-gray-800 border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-gray-600">
                        <h3 className="text-2xl font-semibold text-white">{title}</h3>
                        <button
                            className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-white bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                    <div className="relative flex-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
        </div>
    );
};

export default function UserPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [level, setLevel] = useState<string[]>(['admin', 'user']);
    const [levelSelected, setLevelSelected] = useState<string>("admin");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setCurrentUserId(parseInt(localStorage.getItem('next_user_id') || '0'));
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(config.apiServer + '/api/user/list');
            setUsers(response.data.results);
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
                background: '#1f2937',
                color: '#ffffff'
            })
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                id: id,
                name: name,
                level: levelSelected,
                username: username,
                password: password
            }

            if (id == 0) {
                await axios.post(config.apiServer + '/api/user/create', payload);
            } else {
                await axios.put(config.apiServer + '/api/user/update', payload);
                setId(0);
            }

            fetchData();
            setIsModalOpen(false);
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
                background: '#1f2937',
                color: '#ffffff'
            })
        }
    }

    const handleClearForm = () => {
        setName("");
        setLevelSelected("admin");
        setUsername("");
        setPassword("");
        setId(0);
    }

    const handleEdit = (id: number) => {
        const user = users.find((user) => user.id == id);

        setId(id);
        setName(user.name);
        setLevelSelected(user.level);
        setUsername(user.username);
        setPassword(user.password);
        setIsModalOpen(true);
    }

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                background: '#1f2937',
                color: '#ffffff'
            });
            
            if (button.isConfirmed) {
               await axios.delete(config.apiServer + '/api/user/remove/' + id);
               fetchData();
            }
        } catch (e: any) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
                background: '#1f2937',
                color: '#ffffff'
            })
        }
    }

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">User Management</h2>
                    <button 
                        onClick={() => {
                            handleClearForm();
                            setIsModalOpen(true);
                        }}
                          data-bs-toggle="modal"
                          data-bs-target="#modalUser"

                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                    >
                        <Plus className="mr-2" size={20} />
                        Add User
                    </button>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-white">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Level</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition duration-300">
                                        <td className="px-4 py-3">{user.name}</td>
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                user.level === 'admin' 
                                                    ? 'bg-red-500/20 text-red-400' 
                                                    : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {user.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {currentUserId != user.id && (
                                                <div className="flex justify-center space-x-2">
                                                    <button 
                                                         data-bs-toggle="modal"
                                                         data-bs-target="#modalUser"
                                                        onClick={() => handleEdit(user.id)}
                                                        className="text-blue-400 hover:text-blue-300 transition duration-300"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-400 hover:text-red-300 transition duration-300"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <MyModal id="modalUser" title="User" >
    <div className="space-y-4 bg-gray-950 p-6 rounded-md">
        <div>
            <label className="block text-sm font-medium text-white mb-2">
                <User className="inline-block mr-2 -mt-1" size={18} />
                Name
            </label>
            <input 
                className="w-full bg-blue-800 border border-blue-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-2">
                <UserPlus className="inline-block mr-2 -mt-1" size={18} />
                User Level
            </label>
            <select 
                className="w-full bg-blue-800 border border-blue-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={levelSelected} 
                onChange={(e) => setLevelSelected(e.target.value)}
            >
                {level.map((levelOption) => (
                    <option key={levelOption} value={levelOption} className="bg-blue-900">
                        {levelOption}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-2">
                <User className="inline-block mr-2 -mt-1" size={18} />
                Username
            </label>
            <input 
                className="w-full bg-blue-800 border border-blue-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-2">
                <Lock className="inline-block mr-2 -mt-1" size={18} />
                Password
            </label>
            <input 
                type="password" 
                className="w-full bg-blue-800 border border-blue-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
        </div>

        <div className="flex justify-end">
            <button 
                onClick={handleSave}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
                <Check className="mr-2" size={20} />
                Save
            </button>
        </div>
    </div>
</MyModal>


           
        </div>
    )
}