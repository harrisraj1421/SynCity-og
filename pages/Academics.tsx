
import React, { useState, useEffect } from 'react';
import * as api from '../services/mockApi';
import { AcademicResource } from '../types';
import Spinner from '../components/common/Spinner';
import { DocumentTextIcon, ArchiveBoxIcon, BeakerIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const resourceIcons = {
    'notes': DocumentTextIcon,
    'project-kit': ArchiveBoxIcon,
    'paper': BeakerIcon
};

const ResourceCard: React.FC<{ resource: AcademicResource }> = ({ resource }) => {
    const Icon = resourceIcons[resource.type];
    return (
        <div className="bg-dark-card border border-dark-border p-6 rounded-lg flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                     <Icon className="w-8 h-8 text-brand-primary" />
                     <div>
                        <h3 className="font-bold text-lg text-dark-text-primary">{resource.title}</h3>
                        <span className="text-xs capitalize bg-gray-700 px-2 py-1 rounded">{resource.type.replace('-', ' ')}</span>
                     </div>
                </div>
                <span className="text-xs text-dark-text-secondary bg-dark-bg px-2 py-1 rounded">{resource.campus}</span>
            </div>
            <p className="text-sm text-dark-text-secondary flex-grow mb-4">{resource.description}</p>
            <div className="flex justify-between items-center mt-auto">
                 <p className="text-xs text-dark-text-secondary">Uploaded by: {resource.uploader}</p>
                 <a href={resource.downloadUrl} className="flex items-center space-x-2 bg-brand-secondary text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-emerald-600 transition-colors">
                     <ArrowDownTrayIcon className="w-5 h-5"/>
                     <span>Download</span>
                 </a>
            </div>
        </div>
    );
};

const Academics: React.FC = () => {
    const [resources, setResources] = useState<AcademicResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getAcademicResources().then(data => {
            setResources(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Academic Resources</h2>
                 <button className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Upload Resource
                 </button>
            </div>
            {isLoading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(res => <ResourceCard key={res.id} resource={res} />)}
                </div>
            )}
        </div>
    );
};

export default Academics;
