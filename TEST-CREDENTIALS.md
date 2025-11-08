# RBAC Test Credentials

Use these credentials to test different role permissions in the admin dashboard.

## Mock User Accounts (Development Only)

These credentials work **without hitting the backend API** - they're handled entirely in the frontend for RBAC testing.

### Super Admin
- **Email**: `admin@proplinq.com`
- **Password**: `admin123`
- **Access**: Full access to everything

### Customer Support
- **Email**: `support@proplinq.com`
- **Password**: `support123`
- **Access**:
  - Support Dashboard (full)
  - Users (view only)
  - Bookings (view only)
  - KYC (view only)

### Operations & Admin
- **Email**: `operations@proplinq.com`
- **Password**: `operations123`
- **Access**:
  - Operations Dashboard (full)
  - Transactions (full control)
  - Bookings (edit)
  - KYC (edit)
  - Data Management (view)

### Sales & Partnerships
- **Email**: `sales@proplinq.com`
- **Password**: `sales123`
- **Access**:
  - Sales Dashboard (full)
  - Users (full - for onboarding)
  - Blog Posts (edit)
  - KYC (view)

### Marketing & Growth
- **Email**: `marketing@proplinq.com`
- **Password**: `marketing123`
- **Access**:
  - Marketing Dashboard (full)
  - Blog Posts (full)
  - Users (view only)
  - Bookings (view only)
  - KYC (view only)

---

## How It Works

1. **Login**: Use any of the credentials above
2. **Navigation**: The sidebar menu automatically filters based on your role
3. **Access Control**: Try accessing pages you don't have permission for - you'll see the "Access Denied" page
4. **Role Badge**: Your current role is displayed in the header dropdown

## Testing Workflow

1. Login with `support@proplinq.com` / `support123`
2. Notice you only see: Support Dashboard, Users, Bookings, KYC
3. Try to manually navigate to `/operations-dashboard` - you'll be blocked
4. Logout and login with `operations@proplinq.com` / `operations123`
5. Now you see different menu items based on Operations role
6. Repeat for all roles to test the RBAC system

## Production Note

⚠️ **These test credentials only work in development**. In production:
- The mock user system is disabled
- All logins go through the real backend API
- Real user roles from the database determine permissions
- The test credentials hint is hidden on the login page

---

## Backend Integration (Future)

When the backend is ready:
1. The backend should return the user's `role` in the login response
2. Each API endpoint should validate the user's role/permissions
3. Frontend RBAC is **UI only** - security happens on the backend
4. Replace mock data in dashboard stores with real API calls
