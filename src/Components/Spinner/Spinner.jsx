import Lottie from 'lottie-react';
import loadingAnim from '../../assets/Lottifiles/Run cycle recreated in Lottie Creator.json'
import React from 'react';

const Spinner = () => {
    return (
        <div className='text-center' >

            <div role="status" className='flex gap-4 items-center justify-center h-screen'>
                <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Loading...</span>
                <div className="mt-6 w-40 h-40">
                            <Lottie animationData={loadingAnim} loop={true} />
                </div>
                <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Loading...</span>
            </div>
            

        </div>
    );
};

export default Spinner;