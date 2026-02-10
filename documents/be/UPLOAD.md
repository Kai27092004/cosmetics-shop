# 📤 UPLOAD FILE - UPLOAD DOCUMENTATION

## 📋 Tổng Quan

Module upload file hỗ trợ:
- Upload ảnh sản phẩm
- Validate file type (chỉ ảnh)
- Giới hạn kích thước file (5MB)
- Tự động tạo tên file unique
- Lưu file vào thư mục `public/upload`

---

## 📸 1. UPLOAD ẢNH - UPLOAD IMAGE

### Endpoint:
```
POST /api/upload/image
```

### Authentication:
```
Không yêu cầu (Public endpoint)
```

### Request:
- **Content-Type**: `multipart/form-data`
- **Field name**: `image`
- **File types**: JPEG, JPG, PNG, GIF, WEBP
- **Max size**: 5MB

### cURL Example:
```bash
curl -X POST http://localhost:8080/api/upload/image \
  -F "image=@/path/to/image.jpg"
```

### JavaScript Example (FormData):
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:8080/api/upload/image', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.url); // "/upload/filename-123456789.jpg"
```

### Response Success (200):
```json
{
  "success": true,
  "message": "Upload ảnh thành công",
  "data": {
    "url": "/upload/giuong-1-1707456789123-987654321.jpg",
    "filename": "giuong-1-1707456789123-987654321.jpg",
    "size": 245678
  }
}
```

### Response Error:
```json
// Không có file (400)
{
  "success": false,
  "message": "Không có file nào được upload"
}

// File không phải ảnh (400)
{
  "success": false,
  "message": "Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF, WEBP)"
}

// File quá lớn (400)
{
  "success": false,
  "message": "File quá lớn. Kích thước tối đa là 5MB"
}

// Lỗi server (500)
{
  "success": false,
  "message": "Lỗi khi upload ảnh"
}
```

---

## ⚙️ 2. CẤU HÌNH MULTER

### A. Storage Configuration

#### Destination:
```javascript
const uploadDir = path.join(__dirname, '../public/upload');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
```

#### Filename:
```javascript
filename: (req, file, cb) => {
  // Tạo tên file unique: timestamp-randomstring-originalname
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  const nameWithoutExt = path.basename(file.originalname, ext);
  cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
}
```

#### Ví dụ:
```
Original: giuong-1.jpg
Generated: giuong-1-1707456789123-987654321.jpg
```

### B. File Filter

#### Allowed Types:
```javascript
const allowedTypes = /jpeg|jpg|png|gif|webp/;

const fileFilter = (req, file, cb) => {
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};
```

#### MIME Types:
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/gif`
- `image/webp`

### C. File Size Limit

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: fileFilter
});
```

---

## 📁 3. THƯ MỤC LƯU TRỮ

### Cấu trúc:
```
backend/
├── public/
│   └── upload/
│       ├── giuong-1.jpg
│       ├── giuong-1-1.jpg
│       ├── giuong-1-2.jpg
│       ├── sofa-1.jpg
│       └── ...
├── server.js
└── routes/
    └── upload.routes.js
```

### Static Files:
```javascript
// server.js
app.use(express.static('public'));
```

### URL Access:
```
http://localhost:8080/upload/giuong-1.jpg
```

---

## 🔗 4. SỬ DỤNG TRONG SẢN PHẨM

### A. Tạo sản phẩm với ảnh:
```javascript
// 1. Upload ảnh chính
const formData1 = new FormData();
formData1.append('image', mainImage);
const res1 = await fetch('/api/upload/image', { method: 'POST', body: formData1 });
const { url: imageUrl } = await res1.json().data;

// 2. Upload ảnh phụ
const subImages = [];
for (const file of subImageFiles) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
  const { url } = await res.json().data;
  subImages.push(url);
}

// 3. Tạo sản phẩm
await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Giường ngủ Diệp Mộc',
    price: 5000000,
    imageUrl: imageUrl,
    subImages: subImages,
    ...
  })
});
```

### B. Hiển thị ảnh:
```html
<!-- Ảnh chính -->
<img src="http://localhost:8080/upload/giuong-1.jpg" alt="Giường ngủ" />

<!-- Hoặc dùng relative path -->
<img src="/upload/giuong-1.jpg" alt="Giường ngủ" />
```

---

## 🛡️ 5. BẢO MẬT

### A. File Type Validation:
- ✅ Kiểm tra extension (.jpg, .png, ...)
- ✅ Kiểm tra MIME type (image/jpeg, ...)
- ❌ Không chấp nhận file khác (PDF, EXE, ...)

### B. File Size Limit:
- ✅ Giới hạn 5MB
- ✅ Ngăn chặn DoS attacks

### C. Filename Sanitization:
- ✅ Tạo tên file unique
- ✅ Tránh trùng lặp
- ✅ Tránh path traversal attacks

### D. Rate Limiting:
- ✅ Upload endpoints: 20 requests / 1 giờ
- ✅ Ngăn chặn spam

---

## 🔧 6. ERROR HANDLING

### A. Multer Errors:
```javascript
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa là 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: error.message || 'Lỗi server'
  });
});
```

### B. Common Errors:
- `LIMIT_FILE_SIZE`: File quá lớn
- `LIMIT_FILE_COUNT`: Quá nhiều file
- `LIMIT_UNEXPECTED_FILE`: Field name không đúng

---

## 📊 7. FRONTEND INTEGRATION

### A. React Example:
```jsx
import { useState } from 'react';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8080/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Upload success:', result.data.url);
        alert('Upload thành công!');
      } else {
        alert('Upload thất bại: ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="200" />}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Đang upload...' : 'Upload'}
      </button>
    </div>
  );
}
```

### B. Drag & Drop Example:
```jsx
function DragDropUpload() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const formData = new FormData();
      formData.append('image', files[0]);

      const response = await fetch('http://localhost:8080/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log(result);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? '2px dashed #db2777' : '2px dashed #ccc',
        padding: '50px',
        textAlign: 'center'
      }}
    >
      Kéo thả ảnh vào đây
    </div>
  );
}
```

---

## 🗑️ 8. XÓA ẢNH (TODO)

### Endpoint (chưa triển khai):
```
DELETE /api/upload/image/:filename
```

### Xử lý:
```javascript
router.delete('/image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../public/upload', filename);

    // Kiểm tra file tồn tại
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File không tồn tại'
      });
    }

    // Xóa file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh'
    });
  }
});
```

### Lưu ý:
- ⚠️ Cần kiểm tra ảnh có đang được sử dụng không
- ⚠️ Cần quyền admin
- ⚠️ Cần validate filename (tránh path traversal)

---

## 📈 9. OPTIMIZATION

### A. Image Compression (TODO):
```javascript
const sharp = require('sharp');

// Resize và compress ảnh
await sharp(file.path)
  .resize(800, 800, { fit: 'inside' })
  .jpeg({ quality: 80 })
  .toFile(outputPath);
```

### B. CDN Integration (TODO):
- Upload lên AWS S3
- Upload lên Cloudinary
- Upload lên Google Cloud Storage

### C. Lazy Loading:
```html
<img src="/upload/giuong-1.jpg" loading="lazy" alt="Giường ngủ" />
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Upload ảnh (JPEG, JPG, PNG, GIF, WEBP)
2. ✅ Validate file type
3. ✅ Giới hạn kích thước (5MB)
4. ✅ Tạo tên file unique
5. ✅ Lưu vào thư mục public/upload
6. ✅ Error handling
7. 🔜 Xóa ảnh (TODO)
8. 🔜 Image compression (TODO)

### Bảo mật:
- ✅ File type validation
- ✅ File size limit (5MB)
- ✅ Filename sanitization
- ✅ Rate limit: 20 requests / 1 giờ
- ✅ Public endpoint (không cần authentication)

### Frontend:
- ✅ FormData upload
- ✅ Preview image
- ✅ Drag & drop support
- ✅ Progress indicator

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
