import * as React from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLoaderData, useMatch } from "react-router-dom";
import { Monitor, CirclePlus, House } from "lucide-react";
import { getUser } from "../api";
import { ModeToggle } from "../components/mode-toggle";
import { Sheet, SheetContent, SheetTitle } from "../components/ui/sheet";
import { UserAvatar } from "../components/user-avatar";
import { cn } from "../lib/cn";
import { privateLoader } from "../lib/private-loader";
import type { User } from "../types";

function NavigationItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: React.ReactNode;
  icon: React.ElementType;
}) {
  const match = useMatch(to);

  return (
    <Link
      to={to}
      className={cn(
        "h-full px-4 flex items-center justify-center border-b-2 border-transparent hover:bg-accent transition-colors",
        match 
          ? "border-primary text-primary font-medium" 
          : "text-foreground/60 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-5" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}

function Navigation({ user }: { user?: User }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <nav className="flex items-center gap-4 h-full">
          <NavigationItem to="/" icon={House} label="Home" />
          <NavigationItem to="/products" icon={Monitor} label="Products" />
          {user?.role === "rolos admir" && (
            <NavigationItem to="/add" icon={CirclePlus} label="Add Product" />
          )}
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user && <UserAvatar user={user} />}
        </div>
      </div>
    </header>
  );
}

function MobileNavigationItem(props: {
  to: string;
  onClick: () => void;
  icon: React.ElementType;
  label: React.ReactNode;
}) {
  const Icon = props.icon;

  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 rounded-lg p-2",
          isActive ? "bg-primary hover:bg-primary/90" : "hover:bg-accent",
        )
      }
      onClick={props.onClick}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn("size-6", isActive && "text-primary-foreground")}
          />
          <span
            className={cn("text-base", isActive && "text-primary-foreground")}
          >
            {props.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function MobileNavigation(props: {
  open: boolean;
  onOpenChange: () => void;
  user?: User;
}) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        className="max-w-72"
        side="left"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="mr-6 flex flex-col gap-4">
          <MobileNavigationItem
            to="/"
            onClick={props.onOpenChange}
            icon={House}
            label="Home"
          />
          <MobileNavigationItem
            to="/products"
            onClick={props.onOpenChange}
            icon={Monitor}
            label="Products"
          />
          {props.user?.role === "rolos admir" && (
            <MobileNavigationItem
              to="/add"
              onClick={props.onOpenChange}
              icon={CirclePlus}
              label="Add Product"
            />
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

Root.loader = privateLoader(async () => await getUser());

export function Root() {
  const user = useLoaderData() as User;
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <>
      <Navigation user={user} />

      <MobileNavigation
        open={isSheetOpen}
        onOpenChange={() => setIsSheetOpen(false)}
        user={user}
      />

      <div className="pt-16">
        <main className="container mx-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ScrollRestoration />
    </>
  );
}
