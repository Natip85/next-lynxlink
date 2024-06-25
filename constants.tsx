import { Home, Store, Workflow } from "lucide-react";

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
    title: "Products",
    path: "/admin/products",
    icon: (props) => <Workflow {...props} />,
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
    icon: (props) => <Store {...props} />,
  },
];
