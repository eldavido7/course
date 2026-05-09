'use client';

import { useAdmin } from '@/lib/admin-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

export function AdminHeader() {
  const { logout } = useAdmin();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Admin signed out');
    router.push('/admin/login');
  };

  return (
    <header className="border-b border-border sticky top-0 bg-card/50 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-lg sm:text-xl font-bold text-primary">
          LearnHub Admin
        </Link>

        {/* <nav className="hidden sm:flex items-center gap-8">
          <Link href="/admin" className="text-foreground hover:text-primary transition-colors text-sm">
            Dashboard
          </Link>
          <Link href="/admin/courses" className="text-foreground hover:text-primary transition-colors text-sm">
            Courses
          </Link>
        </nav> */}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* <Link href="/dashboard">
            <Button variant="outline" size="sm">Student View</Button>
          </Link> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-10 h-10 rounded-full p-0">
                A
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
