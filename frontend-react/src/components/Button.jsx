/**
 * Reusable Button component that renders as a Link.
 * 
 * Used for navigation buttons throughout the application.
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.class - CSS classes (e.g., 'btn-light', 'btn-outline-light')
 * @param {string} props.url - URL to navigate to
 */
import React from 'react';
import { Link } from 'react-router-dom';

function Button(props) {
    return (
        <Link className={`btn ${props.class}`} to={props.url}>
            {props.text}
        </Link>
    );
}

export default Button;
export default Button

function Button(props) {
    return (
        <Link className={`btn ${props.class}`} to={props.url}>
            {props.text}
        </Link>
    );
}

export default Button;