import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// maybe we can use this later, its not hooked up to anything yet
export function anonymousMiddleware(req: NextRequest, res: NextResponse) {
  const anonymousId = req.cookies.get('anonymousId')?.value || uuidv4()

  // set anon user id in cookie if it doesnt exist
  if (!req.cookies.get('anonymousId')) {
    res.cookies.set('anonymousId', anonymousId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return res
}
