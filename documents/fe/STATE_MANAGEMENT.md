# 🔄 STATE MANAGEMENT - SO SÁNH REDUX, ZUSTAND, CONTEXT API

## 📋 Tổng Quan

Tài liệu này giải thích chi tiết về 3 phương pháp quản lý state phổ biến trong React:
1. **Redux** - State management library phổ biến nhất
2. **Zustand** - State management library nhẹ và đơn giản (đang dùng trong project)
3. **Context API** - Built-in React API (đang dùng cho Theme)

---

## 🎯 1. ZUSTAND (Đang sử dụng trong project)

### A. Giới thiệu

**Zustand** là một state management library cực kỳ nhẹ và đơn giản cho React.

#### Đặc điểm:
- ✅ **Rất nhẹ**: Chỉ ~1KB (gzipped)
- ✅ **API đơn giản**: Không cần Provider, Reducer, Action
- ✅ **TypeScript support**: Type-safe
- ✅ **DevTools**: Hỗ trợ Redux DevTools
- ✅ **Middleware**: persist, devtools, immer, ...
- ✅ **Performance**: Không re-render không cần thiết

### B. Cách sử dụng trong project

#### 1. Auth Store (authStore.js)

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      user: null,
      admin: null,
      userToken: null,
      adminToken: null,
      isAuthenticated: false,
      isAdmin: false,

      // ==================== ACTIONS ====================
      loginUser: (userData, token) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        set({
          user: userData,
          userToken: token,
          isAuthenticated: true,
          isAdmin: false,
        });
      },

      logoutUser: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        
        set({
          user: null,
          userToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      // ... các actions khác
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

#### 2. Cart Store (cartStore.js)

```javascript
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

#### 3. UI Store (uiStore.js)

```javascript
export const useUIStore = create((set, get) => ({
  isLoading: false,
  isSidebarOpen: false,
  isCartDrawerOpen: false,

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  toggleSidebar: () => {
    set({ isSidebarOpen: !get().isSidebarOpen });
  },

  openCartDrawer: () => {
    set({ isCartDrawerOpen: true });
  },

  closeCartDrawer: () => {
    set({ isCartDrawerOpen: false });
  },
}));
```

### C. Sử dụng trong Component

```jsx
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

function MyComponent() {
  // Lấy state và actions từ store
  const { user, isAuthenticated, loginUser, logoutUser } = useAuthStore();
  const { items, addItem, getTotalPrice } = useCartStore();

  // Sử dụng
  const handleLogin = async () => {
    const userData = await api.login(email, password);
    loginUser(userData, userData.token);
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.fullName}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      
      <p>Cart: {items.length} items</p>
      <p>Total: {getTotalPrice()} VND</p>
    </div>
  );
}
```

### D. Middleware: Persist

**Persist middleware** tự động lưu state vào localStorage:

```javascript
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      // ...
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Chỉ lưu những field này
        user: state.user,
        token: state.token,
      }),
    }
  )
);
```

### E. Ưu điểm của Zustand

✅ **Đơn giản**: Không cần Provider, Reducer, Action  
✅ **Nhẹ**: Chỉ 1KB  
✅ **Performance**: Chỉ re-render component cần thiết  
✅ **TypeScript**: Type-safe  
✅ **Middleware**: persist, devtools, immer  
✅ **Không boilerplate**: Code ngắn gọn  
✅ **Dễ học**: API đơn giản, dễ hiểu  

### F. Nhược điểm của Zustand

❌ **Ít tài liệu**: Ít hơn Redux  
❌ **Ecosystem nhỏ**: Ít middleware/plugin hơn Redux  
❌ **Ít người dùng**: Community nhỏ hơn Redux  

---

## 🔴 2. REDUX (Không dùng trong project)

### A. Giới thiệu

**Redux** là state management library phổ biến nhất cho React.

#### Đặc điểm:
- ✅ **Phổ biến**: Được sử dụng rộng rãi
- ✅ **Ecosystem lớn**: Nhiều middleware, plugin
- ✅ **DevTools**: Redux DevTools mạnh mẽ
- ✅ **Time-travel debugging**: Debug dễ dàng
- ✅ **Middleware**: redux-thunk, redux-saga, ...
- ❌ **Boilerplate nhiều**: Code dài dòng
- ❌ **Phức tạp**: Khó học cho người mới

### B. Cách sử dụng Redux

#### 1. Cài đặt

```bash
npm install @reduxjs/toolkit react-redux
```

#### 2. Tạo Store (Redux Toolkit)

```javascript
// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
```

```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
```

#### 3. Provider

```jsx
// main.jsx
import { Provider } from 'react-redux';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

#### 4. Sử dụng trong Component

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from './store/authSlice';

function MyComponent() {
  // Lấy state từ store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Dispatch action
  const handleLogin = async () => {
    const userData = await api.login(email, password);
    dispatch(loginUser({ user: userData, token: userData.token }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.fullName}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### C. Redux vs Zustand

| Feature | Redux | Zustand |
|---------|-------|---------|
| **Kích thước** | ~10KB | ~1KB |
| **Boilerplate** | Nhiều | Ít |
| **Provider** | Cần | Không cần |
| **Reducer** | Cần | Không cần |
| **Action** | Cần | Không cần |
| **Middleware** | Nhiều | Ít hơn |
| **DevTools** | Mạnh mẽ | Có |
| **TypeScript** | Tốt | Tốt |
| **Learning curve** | Cao | Thấp |
| **Performance** | Tốt | Tốt hơn |

### D. Ví dụ so sánh Code

#### Redux (Redux Toolkit):
```javascript
// authSlice.js (30+ lines)
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: { auth: authReducer },
});

// main.jsx
import { Provider } from 'react-redux';
<Provider store={store}>
  <App />
</Provider>

// Component
import { useSelector, useDispatch } from 'react-redux';
const user = useSelector((state) => state.auth.user);
const dispatch = useDispatch();
dispatch(loginUser({ user, token }));
```

#### Zustand (15 lines):
```javascript
// authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loginUser: (user, token) => set({ user, token }),
  logoutUser: () => set({ user: null, token: null }),
}));

// Component (không cần Provider)
import { useAuthStore } from './store/authStore';
const { user, loginUser } = useAuthStore();
loginUser(userData, token);
```

### E. Khi nào dùng Redux?

✅ **Dùng Redux khi:**
- Dự án lớn, phức tạp
- Cần time-travel debugging
- Team đã quen với Redux
- Cần ecosystem lớn (redux-saga, redux-thunk, ...)
- Cần middleware phức tạp

❌ **Không nên dùng Redux khi:**
- Dự án nhỏ, đơn giản
- Muốn code ngắn gọn
- Team mới học React
- Không cần time-travel debugging

---

## ⚛️ 3. CONTEXT API (Đang dùng cho Theme)

### A. Giới thiệu

**Context API** là built-in API của React để chia sẻ data giữa các components.

#### Đặc điểm:
- ✅ **Built-in**: Không cần cài thêm library
- ✅ **Đơn giản**: Dễ học, dễ dùng
- ✅ **Nhẹ**: Không tăng bundle size
- ❌ **Performance**: Re-render nhiều
- ❌ **Không có DevTools**: Khó debug
- ❌ **Không có middleware**: Không có persist, ...

### B. Cách sử dụng trong project

#### ThemeContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo Context
const ThemeContext = createContext();

// 2. Tạo Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Tạo Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### Sử dụng Provider

```jsx
// main.jsx
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

#### Sử dụng trong Component

```jsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### C. Context API vs Zustand

| Feature | Context API | Zustand |
|---------|-------------|---------|
| **Built-in** | ✅ Có | ❌ Không |
| **Bundle size** | 0KB | 1KB |
| **Provider** | Cần | Không cần |
| **Performance** | ❌ Re-render nhiều | ✅ Tối ưu |
| **DevTools** | ❌ Không | ✅ Có |
| **Middleware** | ❌ Không | ✅ Có |
| **Persist** | ❌ Tự code | ✅ Built-in |
| **Learning curve** | Thấp | Thấp |

### D. Vấn đề Performance của Context API

#### Vấn đề:
```jsx
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </UserContext.Provider>
  );
}

// Component A chỉ dùng user
function ComponentA() {
  const { user } = useContext(UserContext);
  // ❌ Re-render khi theme thay đổi (dù không dùng theme)
  return <div>{user?.name}</div>;
}

// Component B chỉ dùng theme
function ComponentB() {
  const { theme } = useContext(UserContext);
  // ❌ Re-render khi user thay đổi (dù không dùng user)
  return <div>{theme}</div>;
}
```

#### Giải pháp 1: Tách Context
```jsx
const UserContext = createContext();
const ThemeContext = createContext();

// Tách thành 2 Provider riêng
<UserProvider>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</UserProvider>
```

#### Giải pháp 2: Dùng Zustand
```javascript
// Zustand tự động optimize, chỉ re-render component cần thiết
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));

// Component A chỉ re-render khi user thay đổi
function ComponentA() {
  const user = useStore((state) => state.user);
  return <div>{user?.name}</div>;
}

// Component B chỉ re-render khi theme thay đổi
function ComponentB() {
  const theme = useStore((state) => state.theme);
  return <div>{theme}</div>;
}
```

### E. Khi nào dùng Context API?

✅ **Dùng Context API khi:**
- State đơn giản (theme, language, ...)
- Không cần persist
- Không cần DevTools
- Không muốn thêm dependency
- State ít thay đổi

❌ **Không nên dùng Context API khi:**
- State phức tạp (auth, cart, ...)
- Cần persist vào localStorage
- Cần DevTools để debug
- State thay đổi thường xuyên
- Cần performance tốt

---

## 📊 4. SO SÁNH TỔNG QUAN

### A. Bảng so sánh

| Feature | Redux | Zustand | Context API |
|---------|-------|---------|-------------|
| **Bundle size** | ~10KB | ~1KB | 0KB |
| **Boilerplate** | Nhiều | Ít | Trung bình |
| **Provider** | Cần | Không cần | Cần |
| **Performance** | Tốt | Tốt nhất | Kém |
| **DevTools** | Mạnh mẽ | Có | Không |
| **Middleware** | Nhiều | Có | Không |
| **Persist** | redux-persist | Built-in | Tự code |
| **TypeScript** | Tốt | Tốt | Tốt |
| **Learning curve** | Cao | Thấp | Thấp |
| **Ecosystem** | Lớn | Nhỏ | Không |
| **Community** | Lớn | Trung bình | Lớn |

### B. Khi nào dùng cái gì?

#### Dùng **Redux** khi:
- ✅ Dự án lớn, phức tạp
- ✅ Cần time-travel debugging
- ✅ Team đã quen Redux
- ✅ Cần ecosystem lớn

#### Dùng **Zustand** khi:
- ✅ Dự án vừa và nhỏ
- ✅ Muốn code ngắn gọn
- ✅ Cần performance tốt
- ✅ Cần persist dễ dàng
- ✅ **Khuyến nghị cho hầu hết dự án**

#### Dùng **Context API** khi:
- ✅ State đơn giản (theme, language)
- ✅ Không muốn thêm dependency
- ✅ State ít thay đổi
- ✅ Không cần persist

---

## 🎯 5. BEST PRACTICES

### A. Zustand Best Practices

#### 1. Tách Store theo chức năng
```javascript
// ✅ Tốt: Tách thành nhiều store
useAuthStore.js
useCartStore.js
useProductStore.js
useUIStore.js

// ❌ Tránh: Một store quá lớn
useGlobalStore.js (chứa tất cả)
```

#### 2. Sử dụng Selector
```javascript
// ✅ Tốt: Chỉ lấy state cần thiết
const user = useAuthStore((state) => state.user);

// ❌ Tránh: Lấy toàn bộ store
const store = useAuthStore();
```

#### 3. Sử dụng Persist cho data cần lưu
```javascript
// ✅ Tốt: Persist auth, cart
export const useAuthStore = create(
  persist(
    (set) => ({ ... }),
    { name: 'auth-storage' }
  )
);

// ❌ Tránh: Persist UI state (không cần)
export const useUIStore = create(
  persist(
    (set) => ({ isLoading: false }),
    { name: 'ui-storage' } // Không cần persist
  )
);
```

#### 4. Actions nên là functions
```javascript
// ✅ Tốt: Actions là functions
loginUser: (userData, token) => {
  set({ user: userData, token });
},

// ❌ Tránh: Trực tiếp set state từ component
const { user } = useAuthStore();
useAuthStore.setState({ user: newUser }); // Không nên
```

### B. Context API Best Practices

#### 1. Tách Context theo chức năng
```jsx
// ✅ Tốt
<ThemeProvider>
  <LanguageProvider>
    <App />
  </LanguageProvider>
</ThemeProvider>

// ❌ Tránh: Một Context chứa tất cả
<GlobalProvider> // theme, language, user, cart, ...
  <App />
</GlobalProvider>
```

#### 2. Memoize Context value
```jsx
// ✅ Tốt: Memoize để tránh re-render
const value = useMemo(
  () => ({ theme, toggleTheme }),
  [theme]
);

return (
  <ThemeContext.Provider value={value}>
    {children}
  </ThemeContext.Provider>
);

// ❌ Tránh: Tạo object mới mỗi lần render
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {children}
</ThemeContext.Provider>
```

#### 3. Tạo Custom Hook
```jsx
// ✅ Tốt: Custom hook với error handling
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ❌ Tránh: Dùng trực tiếp useContext
const theme = useContext(ThemeContext); // Không có error handling
```

---

## 💡 6. KẾT LUẬN

### Trong project này:

1. **Zustand** - Dùng cho state phức tạp:
   - ✅ Auth (user, admin, token)
   - ✅ Cart (items, total)
   - ✅ Product (cache, filters)
   - ✅ UI (loading, modals, drawers)

2. **Context API** - Dùng cho state đơn giản:
   - ✅ Theme (light/dark mode)

### Khuyến nghị:

- 🎯 **Dự án nhỏ/vừa**: Dùng **Zustand**
- 🎯 **Dự án lớn**: Dùng **Redux Toolkit**
- 🎯 **State đơn giản**: Dùng **Context API**

### Tại sao project này chọn Zustand?

1. ✅ **Đơn giản**: Code ngắn gọn, dễ hiểu
2. ✅ **Performance**: Tối ưu re-render
3. ✅ **Persist**: Built-in middleware
4. ✅ **Nhẹ**: Chỉ 1KB
5. ✅ **DevTools**: Hỗ trợ debug
6. ✅ **TypeScript**: Type-safe
7. ✅ **Không boilerplate**: Không cần Provider, Reducer, Action

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
