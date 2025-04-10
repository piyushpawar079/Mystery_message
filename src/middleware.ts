import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req, token) {
    // console.log(req.nextauth)
    // console.log(req.nextauth.token)
    // console.log(token)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  },
)

export const config = { matcher: ["/"] }