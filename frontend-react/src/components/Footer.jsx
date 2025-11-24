/**
 * Footer component - Displays copyright information.
 * 
 * Simple footer component shown at the bottom of all pages.
 */
import React from 'react';

const Footer = () => {
    return (
        <div className='footer py-3 my-3'>
            <hr className='border-bottom' />
            <p className='text-light text-center'>
                &copy; 2025 - Yasin Ahmed Dema
            </p>
        </div>
    );
};

export default Footer