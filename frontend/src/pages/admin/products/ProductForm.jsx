import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { getImageUrl } from '../../../utils/helpers';

export default function ProductForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Lưu'
}) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false); // Separate state for upload

  // Additional images state (max 5 images)
  const [additionalImages, setAdditionalImages] = useState(['', '', '', '', '']); // URLs
  const [additionalPreviews, setAdditionalPreviews] = useState(['', '', '', '', '']); // Preview URLs
  const [uploadingAdditional, setUploadingAdditional] = useState([false, false, false, false, false]); // Upload status for each

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price,
        stockQuantity: initialData.stockQuantity,
        categoryId: initialData.categoryId || initialData.category?.id || '',
        imageUrl: initialData.imageUrl || '',
      });
      // Always update preview when initialData changes
      setPreviewImage(getImageUrl(initialData.imageUrl));

      // Load additional images if exists
      if (initialData.images && Array.isArray(initialData.images)) {
        const imageUrls = initialData.images.map(img => img.imageUrl);
        const newAdditionalImages = ['', '', '', '', ''];
        const newAdditionalPreviews = ['', '', '', '', ''];

        imageUrls.forEach((url, index) => {
          if (index < 5) {
            newAdditionalImages[index] = url;
            newAdditionalPreviews[index] = getImageUrl(url);
          }
        });

        setAdditionalImages(newAdditionalImages);
        setAdditionalPreviews(newAdditionalPreviews);
      }
    } else {
      // Reset form when creating new product
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        imageUrl: '',
      });
      setPreviewImage('');
      setAdditionalImages(['', '', '', '', '']);
      setAdditionalPreviews(['', '', '', '', '']);
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Vui lòng chọn file ảnh' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imageUrl: 'Kích thước ảnh không được vượt quá 5MB' }));
      return;
    }

    // Create immediate preview for better UX
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file to server
    try {
      setUploading(true);
      const uploadService = (await import('../../../services/uploadService')).default;
      const result = await uploadService.uploadImage(file);

      // Update form data with real server URL
      setFormData(prev => ({ ...prev, imageUrl: result.url }));

      // Clear error
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, imageUrl: error.message }));
      // Reset preview on error
      setPreviewImage('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setPreviewImage('');
  };

  // Handle additional image upload
  const handleAdditionalImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [`additionalImage${index}`]: 'Vui lòng chọn file ảnh' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [`additionalImage${index}`]: 'Kích thước ảnh không được vượt quá 5MB' }));
      return;
    }

    // Immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...additionalPreviews];
      newPreviews[index] = reader.result;
      setAdditionalPreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const newUploadingStatus = [...uploadingAdditional];
      newUploadingStatus[index] = true;
      setUploadingAdditional(newUploadingStatus);

      const uploadService = (await import('../../../services/uploadService')).default;
      const result = await uploadService.uploadImage(file);

      // Update URL
      const newImages = [...additionalImages];
      newImages[index] = result.url;
      setAdditionalImages(newImages);

      // Clear error
      if (errors[`additionalImage${index}`]) {
        const newErrors = { ...errors };
        delete newErrors[`additionalImage${index}`];
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, [`additionalImage${index}`]: error.message }));
      // Reset preview on error
      const newPreviews = [...additionalPreviews];
      newPreviews[index] = '';
      setAdditionalPreviews(newPreviews);
    } finally {
      const newUploadingStatus = [...uploadingAdditional];
      newUploadingStatus[index] = false;
      setUploadingAdditional(newUploadingStatus);
    }
  };

  // Remove additional image
  const handleRemoveAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    newImages[index] = '';
    setAdditionalImages(newImages);

    const newPreviews = [...additionalPreviews];
    newPreviews[index] = '';
    setAdditionalPreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (!formData.stockQuantity || formData.stockQuantity < 0) newErrors.stockQuantity = 'Số lượng không hợp lệ';
    if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare subImages - include all slots (empty or filled)
    // This ensures existing images are preserved
    const subImagesData = additionalImages.filter(url => url && url.trim() !== '');

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      categoryId: parseInt(formData.categoryId),
      imageUrl: formData.imageUrl.trim(),
      subImages: subImagesData, // Send all images (existing + new)
    };

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left:  Form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tên sản phẩm */}
          <Input
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={loading}
            placeholder="Ví dụ: Son môi Maybelline"
          />

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mô tả chi tiết về sản phẩm..."
              disabled={loading}
            />
          </div>

          {/* Giá và Số lượng */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá (VNĐ)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
              disabled={loading}
              placeholder="150000"
            />

            <Input
              label="Số lượng tồn kho"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
              required
              disabled={loading}
              placeholder="100"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`w - full px - 4 py - 2 border rounded - lg focus: outline - none focus: ring - 2 focus: ring - primary - 500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                } `}
              disabled={loading}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ảnh sản phẩm
            </label>
            <div className="flex items-center gap-4">
              {previewImage ? (
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f0f0f0" width="128" height="128"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="4" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Xóa ảnh"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading || uploading}
                />
                <label
                  htmlFor="imageUpload"
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all ${(loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {uploading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {previewImage ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Chọn ảnh JPG, PNG hoặc GIF (tối đa 5MB)
                </p>
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ảnh phụ (Tối đa 5 ảnh) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Ảnh phụ (Tối đa 5 ảnh)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="relative">
                  {additionalPreviews[index] ? (
                    <div className="relative group">
                      <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={additionalPreviews[index]}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23f0f0f0" width="128" height="128"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="4" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa ảnh"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-pink-400 transition-colors">
                      <input
                        type="file"
                        id={`additionalImage${index}`}
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageUpload(e, index)}
                        className="hidden"
                        disabled={loading || uploadingAdditional[index]}
                      />
                      <label
                        htmlFor={`additionalImage${index}`}
                        className="cursor-pointer flex flex-col items-center p-4"
                      >
                        {uploadingAdditional[index] ? (
                          <>
                            <svg className="w-8 h-8 text-pink-500 animate-spin mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-xs text-gray-500">Đang tải...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-gray-500">Thêm ảnh</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                  {errors[`additionalImage${index}`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`additionalImage${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Chọn tối đa 5 ảnh phụ để hiển thị nhiều góc nhìn của sản phẩm
            </p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Xem trước ảnh
            </label>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="8" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Nhập URL ảnh để xem preview
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          size="lg"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          size="lg"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}