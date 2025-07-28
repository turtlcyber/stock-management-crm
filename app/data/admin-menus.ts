import {
  BriefcaseBusinessIcon,
  Building,
  ContactRoundIcon,
  Home,
  MegaphoneIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersRoundIcon,
} from "lucide-react";

const prefix = "";
export const adminMenus = [
  {
    id: 101,
    title: "Dashboard",
    icon: Home,
    href: prefix,
  },
  {
    id: 102,
    title: "Products",
    icon: BriefcaseBusinessIcon,
    href: prefix + "/products",
  },
  {
    id: 103,
    title: "Customers",
    icon: UsersRoundIcon,
    href: prefix + "/customers",
  },
  {
    id: 104,
    title: "Orders",
    icon: ShoppingBagIcon,
    href: prefix + "/orders",
  },
  {
    id: 105,
    title: "Company",
    icon: Building,
    href: prefix + "/company",
  },
];
