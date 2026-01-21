import axios from 'axios';

const API_URL = '/api/upload';

const uploadService = {
    /**
     * Upload image to server
     * @param {File} file - Image file to upload
     * @returns {Promise<{url: string}>} - Uploaded image URL
     */
    uploadImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${API_URL}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Không thể upload ảnh'
            );
        }
    },
};

export default uploadService;
