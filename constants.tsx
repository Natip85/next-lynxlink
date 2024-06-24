import { Home, Store, Workflow } from "lucide-react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  submenuItems?: SideNavItem[];
};

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Admin",
    path: "/admin",
    icon: <Home />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <Workflow />,
    submenu: true,
    submenuItems: [
      { title: "Add product", path: "/admin/products/new" },
      { title: "All2", path: "/admin/products2" },
      { title: "All3", path: "/admin/products3" },
    ],
  },
  {
    title: "Live store",
    path: "/",
    icon: <Store />,
  },
];
