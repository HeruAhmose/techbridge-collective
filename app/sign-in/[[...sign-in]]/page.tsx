import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="bg-linen">
      <div className="mx-auto max-w-lg px-4 py-14">
        <SignIn />
      </div>
    </main>
  );
}
