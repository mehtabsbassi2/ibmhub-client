
export const validateResponse = (response) => {
    // Check HTTP status
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP Error: ${response.status}`)
    }
    
    // Check response body structure
    const data = response.data
    
    // If API uses success flag
    if (data.hasOwnProperty('success') && !data.success) {
        throw new Error(data.error || data.message || 'Operation failed')
    }
    
    // If API uses error field
    if (data.error) {
        throw new Error(data.error)
    }
    
    return data
}