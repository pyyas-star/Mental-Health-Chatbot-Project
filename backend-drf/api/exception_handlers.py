"""
Custom exception handlers for Django REST Framework.

Provides consistent error response format and logging for all API errors.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('api')


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error formatting.
    
    Args:
        exc: The exception instance
        context: Context dictionary with request information
        
    Returns:
        Response: Formatted error response
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # Log the exception
    request = context.get('request')
    if request:
        logger.error(
            f"API Error: {exc.__class__.__name__} - {str(exc)} "
            f"- Path: {request.path} - Method: {request.method}"
        )
    
    # Customize response format
    if response is not None:
        custom_response_data = {
            'error': True,
            'status_code': response.status_code,
            'message': _get_error_message(response.data),
            'details': response.data
        }
        response.data = custom_response_data
    else:
        # Handle unexpected exceptions
        logger.exception(f"Unhandled exception: {str(exc)}")
        custom_response_data = {
            'error': True,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'message': 'An unexpected error occurred. Please try again later.',
            'details': {}
        }
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return response


def _get_error_message(error_data):
    """
    Extract a user-friendly error message from error data.
    
    Args:
        error_data: Error data from DRF
        
    Returns:
        str: User-friendly error message
    """
    if isinstance(error_data, dict):
        # Get the first error message
        for key, value in error_data.items():
            if isinstance(value, list) and len(value) > 0:
                return str(value[0])
            elif isinstance(value, str):
                return value
        return 'An error occurred'
    elif isinstance(error_data, list) and len(error_data) > 0:
        return str(error_data[0])
    elif isinstance(error_data, str):
        return error_data
    else:
        return 'An error occurred'



