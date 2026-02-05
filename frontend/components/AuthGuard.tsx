'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Auth-related pages that don't need a session
        const publicPaths = ['/signup', '/login', '/'];
        const isPublicPath = publicPaths.includes(pathname);

        const email = localStorage.getItem('user_email');

        if (!email && !isPublicPath) {
            // No session and trying to access protected page
            setAuthorized(false);
            window.location.replace('/signup');
        } else {
            setAuthorized(true);
        }
    }, [pathname]);

    if (!authorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
