import { Suspense } from "react";

import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-100">
      <Suspense fallback={<div className="text-sm text-slate-400">Loading form…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
