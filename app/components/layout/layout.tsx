import { Link, useMatches } from '@remix-run/react';
import { PropsWithChildren } from 'react';
import { Sidebar, SidebarLink } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';

export function Layout({ children }: PropsWithChildren) {
  const isMobile = useMobile();
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;

  const sidebarLinks: SidebarLink[] = [
    {
      title: 'Organizations Dashboard',
      href: '/orgs-dashboard',
      isActive: currentPath === '/orgs-dashboard',
    },
    {
      title: 'Users Dashboard',
      href: '/users',
      isActive: currentPath === '/users',
    },
  ];

  const SidebarContent = () => (
    <Sidebar links={sidebarLinks} />
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="">Acme Inc</span>
            </Link>
          </div>
          <div className="flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Mobile Header and Sidebar */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span>Acme Inc</span>
                </Link>
                <SidebarContent />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Potentially add a mobile header title or other elements here */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
