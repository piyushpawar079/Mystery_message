import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req, token) {
    
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  },
)

export const config = { matcher: ["/dashboard", "/users", "/u"] }