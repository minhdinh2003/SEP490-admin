import { NavItem } from 'types';
//x
export const navItems: NavItem[] = [
  {
    title: 'Tổng quan',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Sản phẩm',
    url: '#',
    icon: 'product',
    isActive: false,
    items: [
      {
        title: 'Hãng xe',
        url: '/dashboard/product',
        icon: 'userPen',
        shortcut: ['p', 'c']
      },
      {
        title: 'Xe',
        shortcut: ['p', 'c'],
        url: '/',
        icon: 'login'
      },
      {
        title: 'Phụ tùng xe',
        shortcut: ['p', 'd'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Tài khoản',
    url: '#',
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Thông tin',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Đăng nhập',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];
