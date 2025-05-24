import { UserRole } from '@/enum/user-role';

interface PathRoleConfig {
  path: string; // Đường dẫn
  roles: UserRole[]; // Các vai trò được phép truy cập
  fullPath: boolean; // Kiểm tra toàn bộ đường dẫn hay chỉ phần đầu
}

export const pathRoleConfig: PathRoleConfig[] = [
  { path: '/dashboard', roles: [UserRole.ADMIN], fullPath: false } // Admin và user có thể truy cập /dashboard và các route con
];
