"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ThemeSwitch } from "./theme-switch";

export default function NavBar() {
  const rightsToView = {};
  const menuItems = [
    { name: "Dashboard" },
    { name: "Orders", href : "/order" , key : "order"},
    { name: "Failed Orders", key : "order" },
    { name: "POS" },
    { name: "Products" },
    { name: "Offers" },
    { name: "Home Page" },
    {
      name: "CMS",
      subcategories: [
        { name: "Pages" },
        { name: "Media" },
        { name: "Settings" },
      ],
    },
    { name: "Blog" },
    {
      name: "Inventory",
      subcategories: [{ name: "Stock Management" }, { name: "Warehouses" }],
    },
    { name: "Reports" },
    { name: "Master Data" },
  ];
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((eachMenu): any => {
          return eachMenu.subcategories ? (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={<ArrowDropDownIcon />}
                    radius="sm"
                    variant="light"
                  >
                    {eachMenu.name}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label={eachMenu.name}
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                {eachMenu.subcategories.map((eachSubmenu): any => {
                  return (
                    <DropdownItem
                      key={eachSubmenu.name}
                      description={""}
                      //   startContent={icons.scale}
                    >
                      <Link color="foreground" href={eachSubmenu?.href || ""}>
                        {eachSubmenu.name}
                      </Link>
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NavbarItem>
              <Link color="foreground" href={eachMenu?.href || ""}>
                {eachMenu.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <ThemeSwitch />
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
