# 📊 DASHBOARD & THỐNG KÊ - DASHBOARD DOCUMENTATION

## 📋 Tổng Quan

Module Dashboard cung cấp thống kê tổng quan cho Admin:
- Thống kê tổng quan (users, products, orders, revenue)
- Biểu đồ doanh thu theo tháng
- Biểu đồ đơn hàng theo tháng

**Lưu ý**: Tất cả endpoints yêu cầu quyền **Admin**.

---

## 📈 1. THỐNG KÊ TỔNG QUAN - DASHBOARD STATS

### Endpoint:
```
GET /api/dashboard/stats
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProducts": 85,
    "totalOrders": 320,
    "totalRevenue": 450000000
  }
}
```

### Mô tả các trường:
- `totalUsers`: Tổng số người dùng trong hệ thống
- `totalProducts`: Tổng số sản phẩm
- `totalOrders`: Tổng số đơn hàng
- `totalRevenue`: Tổng doanh thu (VND)

### Xử lý:
```javascript
// Đếm tổng số người dùng
const totalUsers = await User.count();

// Đếm tổng số sản phẩm
const totalProducts = await Product.count();

// Đếm tổng số đơn hàng
const totalOrders = await Order.count();

// Tính tổng doanh thu (chỉ đơn đã giao/đang giao/đang xử lý)
const revenueResult = await Order.findOne({
  attributes: [
    [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalRevenue']
  ],
  where: {
    status: ['delivered', 'shipped', 'processing']
  }
});

const totalRevenue = parseFloat(revenueResult.dataValues.totalRevenue) || 0;
```

### SQL Query:
```sql
-- Tổng users
SELECT COUNT(*) FROM users;

-- Tổng products
SELECT COUNT(*) FROM products;

-- Tổng orders
SELECT COUNT(*) FROM orders;

-- Tổng doanh thu
SELECT SUM(totalAmount) as totalRevenue
FROM orders
WHERE status IN ('delivered', 'shipped', 'processing');
```

---

## 📊 2. BIỂU ĐỒ DOANH THU - REVENUE CHART

### Endpoint:
```
GET /api/dashboard/revenue-chart
```

### Query Parameters:
```
?year=2025    // Năm cần xem (mặc định: 2025)
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "success": true,
  "data": [
    {
      "month": "T1",
      "revenue": 35000000,
      "growth": 0
    },
    {
      "month": "T2",
      "revenue": 42000000,
      "growth": 20
    },
    {
      "month": "T3",
      "revenue": 38000000,
      "growth": -10
    },
    {
      "month": "T4",
      "revenue": 45000000,
      "growth": 18
    },
    {
      "month": "T5",
      "revenue": 50000000,
      "growth": 11
    },
    {
      "month": "T6",
      "revenue": 48000000,
      "growth": -4
    },
    {
      "month": "T7",
      "revenue": 52000000,
      "growth": 8
    },
    {
      "month": "T8",
      "revenue": 55000000,
      "growth": 6
    },
    {
      "month": "T9",
      "revenue": 58000000,
      "growth": 5
    },
    {
      "month": "T10",
      "revenue": 60000000,
      "growth": 3
    },
    {
      "month": "T11",
      "revenue": 62000000,
      "growth": 3
    },
    {
      "month": "T12",
      "revenue": 65000000,
      "growth": 5
    }
  ]
}
```

### Mô tả các trường:
- `month`: Tháng (T1, T2, ..., T12)
- `revenue`: Doanh thu tháng đó (VND)
- `growth`: Tỷ lệ tăng trưởng so với tháng trước (%)

### Xử lý:
```javascript
const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
const chartData = [];

for (let i = 0; i < 12; i++) {
  const month = i + 1;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Lấy doanh thu thực tế từ database
  const revenueResult = await Order.findOne({
    attributes: [
      [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'revenue']
    ],
    where: {
      status: ['delivered', 'shipped', 'processing'],
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
  
  const revenue = parseFloat(revenueResult.dataValues.revenue) || 0;
  
  // Tính tăng trưởng (so với tháng trước)
  let growth = 0;
  if (i > 0) {
    const prevRevenue = chartData[i - 1].revenue;
    if (prevRevenue > 0) {
      growth = ((revenue - prevRevenue) / prevRevenue) * 100;
    }
  }
  
  chartData.push({
    month: months[i],
    revenue: Math.round(revenue),
    growth: Math.round(growth)
  });
}
```

### SQL Query:
```sql
-- Doanh thu tháng 1/2025
SELECT SUM(totalAmount) as revenue
FROM orders
WHERE status IN ('delivered', 'shipped', 'processing')
AND createdAt >= '2025-01-01 00:00:00'
AND createdAt <= '2025-01-31 23:59:59';

-- Tính tăng trưởng
growth = ((revenue_current - revenue_previous) / revenue_previous) * 100
```

---

## 📦 3. BIỂU ĐỒ ĐƠN HÀNG - ORDER CHART

### Endpoint:
```
GET /api/dashboard/order-chart
```

### Query Parameters:
```
?year=2025    // Năm cần xem (mặc định: 2025)
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "success": true,
  "data": [
    {
      "month": "Tháng 2",
      "orders": 45
    },
    {
      "month": "Tháng 4",
      "orders": 52
    },
    {
      "month": "Tháng 6",
      "orders": 48
    },
    {
      "month": "Tháng 8",
      "orders": 60
    },
    {
      "month": "Tháng 10",
      "orders": 55
    },
    {
      "month": "Tháng 12",
      "orders": 70
    }
  ]
}
```

### Mô tả:
- Chỉ hiển thị các tháng chẵn (2, 4, 6, 8, 10, 12)
- `month`: Tên tháng
- `orders`: Số lượng đơn hàng trong tháng đó

### Xử lý:
```javascript
const months = ['Tháng 2', 'Tháng 4', 'Tháng 6', 'Tháng 8', 'Tháng 10', 'Tháng 12'];
const chartData = [];

for (let i = 0; i < 6; i++) {
  const month = (i + 1) * 2; // 2, 4, 6, 8, 10, 12
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Đếm số đơn hàng thực tế từ database
  const orderCount = await Order.count({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
  
  chartData.push({
    month: months[i],
    orders: orderCount
  });
}
```

### SQL Query:
```sql
-- Số đơn hàng tháng 2/2025
SELECT COUNT(*) as orders
FROM orders
WHERE createdAt >= '2025-02-01 00:00:00'
AND createdAt <= '2025-02-28 23:59:59';
```

---

## 📊 4. THỐNG KÊ CHI TIẾT

### A. Thống kê theo trạng thái đơn hàng:
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(totalAmount) as revenue
FROM orders
GROUP BY status;
```

### Response:
```json
{
  "pending": { "count": 50, "revenue": 75000000 },
  "processing": { "count": 80, "revenue": 120000000 },
  "shipped": { "count": 60, "revenue": 90000000 },
  "delivered": { "count": 120, "revenue": 180000000 },
  "cancelled": { "count": 10, "revenue": 0 }
}
```

### B. Top sản phẩm bán chạy:
```sql
SELECT 
  products.id,
  products.name,
  SUM(order_items.quantity) as totalSold,
  SUM(order_items.quantity * order_items.price) as revenue
FROM order_items
JOIN products ON order_items.productId = products.id
JOIN orders ON order_items.orderId = orders.id
WHERE orders.status IN ('delivered', 'shipped', 'processing')
GROUP BY products.id
ORDER BY totalSold DESC
LIMIT 10;
```

### C. Top khách hàng:
```sql
SELECT 
  users.id,
  users.fullName,
  users.email,
  COUNT(orders.id) as totalOrders,
  SUM(orders.totalAmount) as totalSpent
FROM users
JOIN orders ON users.id = orders.userId
WHERE orders.status IN ('delivered', 'shipped', 'processing')
GROUP BY users.id
ORDER BY totalSpent DESC
LIMIT 10;
```

---

## 📈 5. TÍNH TOÁN TĂNG TRƯỞNG

### Công thức:
```javascript
growth = ((current - previous) / previous) * 100
```

### Ví dụ:
```javascript
// Tháng 1: 35,000,000 VND
// Tháng 2: 42,000,000 VND

growth = ((42000000 - 35000000) / 35000000) * 100
       = (7000000 / 35000000) * 100
       = 0.2 * 100
       = 20%
```

### Xử lý:
```javascript
let growth = 0;
if (i > 0) {
  const prevRevenue = chartData[i - 1].revenue;
  if (prevRevenue > 0) {
    growth = ((revenue - prevRevenue) / prevRevenue) * 100;
  }
}
```

---

## 🎨 6. FRONTEND INTEGRATION

### A. Chart.js Example:
```javascript
// Revenue Chart
const revenueChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: data.map(d => d.month),
    datasets: [{
      label: 'Doanh thu (VND)',
      data: data.map(d => d.revenue),
      borderColor: 'rgb(219, 39, 119)',
      backgroundColor: 'rgba(219, 39, 119, 0.1)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y.toLocaleString('vi-VN')} VND`;
          }
        }
      }
    }
  }
});
```

### B. Order Chart:
```javascript
const orderChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: data.map(d => d.month),
    datasets: [{
      label: 'Số đơn hàng',
      data: data.map(d => d.orders),
      backgroundColor: 'rgba(219, 39, 119, 0.8)'
    }]
  }
});
```

---

## 📊 7. DASHBOARD CARDS

### A. Total Users Card:
```javascript
{
  title: 'Tổng người dùng',
  value: 150,
  icon: 'users',
  color: 'blue',
  trend: '+12%'
}
```

### B. Total Products Card:
```javascript
{
  title: 'Tổng sản phẩm',
  value: 85,
  icon: 'box',
  color: 'green',
  trend: '+5%'
}
```

### C. Total Orders Card:
```javascript
{
  title: 'Tổng đơn hàng',
  value: 320,
  icon: 'shopping-cart',
  color: 'orange',
  trend: '+18%'
}
```

### D. Total Revenue Card:
```javascript
{
  title: 'Tổng doanh thu',
  value: '450,000,000 VND',
  icon: 'dollar-sign',
  color: 'pink',
  trend: '+25%'
}
```

---

## 🔍 8. FILTER & DATE RANGE

### Lọc theo khoảng thời gian:
```javascript
// Query parameters
?startDate=2025-01-01&endDate=2025-12-31

// SQL
WHERE createdAt >= '2025-01-01 00:00:00'
AND createdAt <= '2025-12-31 23:59:59'
```

### Lọc theo trạng thái:
```javascript
// Query parameters
?status=delivered

// SQL
WHERE status = 'delivered'
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Thống kê tổng quan (users, products, orders, revenue)
2. ✅ Biểu đồ doanh thu theo tháng (12 tháng)
3. ✅ Biểu đồ đơn hàng theo tháng (6 tháng chẵn)
4. ✅ Tính tăng trưởng doanh thu
5. ✅ Lọc theo năm

### Bảo mật:
- ✅ Tất cả endpoints yêu cầu quyền admin
- ✅ Authentication required
- ✅ Authorization check

### Database:
- ✅ Aggregate queries (SUM, COUNT)
- ✅ Date range filtering
- ✅ Status filtering
- ✅ Performance optimized

### Frontend:
- ✅ Chart.js integration
- ✅ Dashboard cards
- ✅ Responsive design
- ✅ Real-time updates

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
