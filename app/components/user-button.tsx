'use client';

import { useSession } from 'next-auth/react';

export default function UserButton() {
  const { data: session } = useSession();
  let email = session?.user?.email || 'No email found';

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm sm:inline-flex">
        {email}<br />
      </span>
    </div>
  );
}