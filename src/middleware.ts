import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pathRoleConfig } from '@/constants/path-role';
import { UserRole } from './enum/user-role';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  if (
    pathname.toLocaleLowerCase().startsWith('/signin') ||
    pathname.toLocaleLowerCase().startsWith('/signup')
  ) {
    return NextResponse.next();
  }

  // Đọc role từ cookies (giả sử role được lưu trong cookies)
  const role = request.cookies.get('role')?.value;
  if (!role) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  // Duyệt qua từng cấu hình để kiểm tra quyền truy cập
  for (const config of pathRoleConfig) {
    const { path, roles, fullPath } = config;

    // Kiểm tra đường dẫn dựa trên cấu hình
    if (
      (fullPath && pathname === path) || // Kiểm tra full path
      (!fullPath && pathname.startsWith(path)) // Kiểm tra phần đầu của path
    ) {
      // Nếu người dùng không có quyền, chuyển hướng đến trang không có quyền hoặc trang đăng nhập
      if (!roles.includes(role as UserRole)) {
        return NextResponse.redirect(new URL('/403', request.url));
      }
    }
  }

  // Nếu không có vấn đề gì, tiếp tục xử lý yêu cầu
  return NextResponse.next();
}

// Giới hạn phạm vi áp dụng middleware
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
