import {
  BarChart3Icon,
  Home,
  StoreIcon,
  TagsIcon,
  Users2Icon,
} from "lucide-react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  submenu?: boolean;
  submenuItems?: SideNavItem[];
};

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Admin",
    path: "/admin",
    icon: (props) => <Home {...props} />,
  },
  {
    title: "Customers",
    path: "/admin/users",
    icon: (props) => <Users2Icon {...props} />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: (props) => <TagsIcon {...props} />,
    submenu: true,
    submenuItems: [
      { title: "Add product", path: "/admin/products/new" },
      { title: "Discount codes", path: "/admin/discount-codes" },
    ],
  },
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: (props) => <BarChart3Icon {...props} />,
  },
  {
    title: "Live store",
    path: "/",
    icon: (props) => <StoreIcon {...props} />,
  },
];
