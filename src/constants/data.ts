import { UserRole } from '@/enum/user-role';
import { NavItem } from 'types';

export const navItems: NavItem[] = [
  {
    title: 'Tổng quan',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    roles: [UserRole.ADMIN],
    items: []
  },
  {
    title: 'Sản phẩm',
    url: '#',
    icon: 'product',
    isActive: false,
    roles: [UserRole.ADMIN],
    items: [
      {
        title: 'Hãng xe',
        url: '/product/brand',
        icon: 'userPen',
        roles: [UserRole.ADMIN],
        shortcut: ['p', 'c']
      },
      {
        title: 'Xe',
        shortcut: ['p', 'c'],
        url: '/product/car',
        roles: [UserRole.ADMIN],
        icon: 'login'
      },
      {
        title: 'Phụ tùng xe',
        shortcut: ['p', 'd'],
        url: '/product/part',
        roles: [UserRole.ADMIN],
        icon: 'login'
      }
    ]
  },
  {
    title: 'Người dùng',
    url: '/user',
    icon: 'user',
    isActive: false,
    roles: [UserRole.ADMIN]
  },
  {
    title: 'Task',
    url: '/task-template',
    icon: 'kanban',
    isActive: false,
    roles: [UserRole.ADMIN]
  },
  {
    title: 'Tài khoản',
    url: '#',
    icon: 'billing',
    isActive: true,
    roles: [],
    items: [
      {
        title: 'Thông tin',
        url: '/dashboard/profile',
        icon: 'userPen',
        roles: [],
        shortcut: ['m', 'm']
      },
      {
        title: 'Đăng nhập',
        shortcut: ['l', 'l'],
        url: '/',
        roles: [],
        icon: 'login'
      }
    ]
  }
];

export const filterNavItems = (items: NavItem[], role: UserRole): NavItem[] => {
  return items
    .filter((item) => item.roles.includes(role)) // Lọc các mục chính
    .map((item) => ({
      ...item,
      items: item.items ? filterNavItems(item.items, role) : [] // Lọc các mục con
    }));
};
