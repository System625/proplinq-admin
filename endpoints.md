First page: Dashboard
GET Dashboard Stats
http://localhost:8000/api/v1/admin/dashboard/stats
Headers:
Accept
application/json
Authorization
Bearer your-access-token-here

GET List Users
http://localhost:8000/api/v1/admin/users
Same headers

GET User Details
http://localhost:8000/api/v1/admin/users/:id
Same headers

Second page: Bookings
GET List All Bookings
http://localhost:8000/api/v1/admin/bookings
Same headers

PUT Manage Booking
http://localhost:8000/api/v1/admin/bookings/:id
Same headers
Body:
{
    "status": "confirmed",
    "admin_notes": "Booking manually confirmed by admin"
}

Third page: Transactions
GET List All Transactions
http://localhost:8000/api/v1/admin/transactions
Same headers

POST Process Refund
http://localhost:8000/api/v1/admin/refunds
Same headers
Body:
{
    "booking_id": 1,
    "amount": 150000,
    "reason": "Full refund approved"
}

Fourth page: KYC Verifications
GET List All KYC Verifications with pagination
http://localhost:8000/api/admin/kyc
Same headers

GET List Pending KYC Verifications with pagination
http://localhost:8000/api/admin/kyc/pending
Same headers

GET View KYC Verification Details specifically
http://localhost:8000/api/admin/kyc/:id
Same headers

POST Review KYC Verification
Review and update status of a KYC verification. Status must be either 'approved' or 'rejected'. When rejecting, provide a rejection_reason.
http://localhost:8000/api/admin/kyc/:id/verify
HEADERS
Accept
application/json

Authorization
Bearer your-access-token-here

Content-Type
application/json

Body:
{
    "status": "approved",
    "rejection_reason": null
}

