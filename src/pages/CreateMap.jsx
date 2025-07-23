import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFolderOpen, faMapMarkedAlt, faClock, faEye } from '@fortawesome/free-solid-svg-icons'

function CreateMap() {
    const navigate = useNavigate()

    // Mock data for existing maps
    const [existingMaps] = useState([
        {
            id: 1,
            name: "Industrial Site A",
            lastModified: "2 hours ago",
            buildings: 12,
            workers: 8,
            thumbnail: "🏭"
        },
        {
            id: 2,
            name: "Warehouse Complex",
            lastModified: "1 day ago",
            buildings: 6,
            workers: 15,
            thumbnail: "🏢"
        },
        {
            id: 3,
            name: "Manufacturing Plant",
            lastModified: "3 days ago",
            buildings: 18,
            workers: 25,
            thumbnail: "🏗️"
        }
    ])

    const handleCreateNewMap = () => {
        // Navigate to site location selector
        navigate('/site-location-selector')
    }

    const handleOpenMap = (mapId) => {
        // Placeholder for editing existing maps
        alert(`Edit map functionality for Map ID: ${mapId} coming soon!`)
    }

    const handleViewMap = (mapId) => {
        // Placeholder for viewing existing maps
        alert(`View map functionality for Map ID: ${mapId} coming soon!`)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-left mt-5">
                <h1 className="text-4xl font-semibold text-gray-900 mb-2">Map Management Center</h1>
                <p className="text-gray-600 mx-auto text-lg">
                    Your central hub for creating new industrial site maps and managing existing ones.
                    Choose to start fresh or continue working on previous projects.
                </p>
            </div>

            {/* Primary Actions */}
            <div className="grid md:grid-cols-2 gap-8 max-w-8xl mx-auto">
                {/* Create New Map */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Create New Map</h3>
                    <p className="text-gray-600 mb-6">
                        Start from scratch and design a new industrial site map with buildings, roads, and worker placements.
                    </p>
                    <button
                        onClick={handleCreateNewMap}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Start Creating
                    </button>
                </div>

                {/* Manage Existing Maps */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faFolderOpen} className="text-gray-600 text-xl" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Manage Existing Maps</h3>
                    <p className="text-gray-600 mb-6">
                        Access, edit, or view your previously created maps. Continue where you left off or make modifications.
                    </p>
                    <div className="text-sm text-gray-500">
                        {existingMaps.length} maps available
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-8xl mx-auto">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                        {existingMaps.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Maps</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                        {existingMaps.reduce((sum, map) => sum + map.buildings, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Buildings</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                        {existingMaps.reduce((sum, map) => sum + map.workers, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Workers</div>
                </div>
            </div>

            {/* Recent Maps */}
            <div className="max-w-8xl mx-auto">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Maps</h2>
                <div className="space-y-3">
                    {existingMaps.map((map) => (
                        <div key={map.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl">{map.thumbnail}</div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{map.name}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                                <span>{map.lastModified}</span>
                                            </span>
                                            <span>{map.buildings} buildings</span>
                                            <span>{map.workers} workers</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleViewMap(map.id)}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="View Map"
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenMap(map.id)}
                                        className="px-3 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default CreateMap