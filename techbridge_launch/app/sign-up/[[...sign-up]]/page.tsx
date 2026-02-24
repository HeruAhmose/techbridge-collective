import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Sign up · TechBridge Collective" };

export default function Page() {
  return (
    <main className="bg-linen">
      <div className="mx-auto max-w-lg px-4 py-14">
        <SignUp />
      </div>
    </main>
  );
}
