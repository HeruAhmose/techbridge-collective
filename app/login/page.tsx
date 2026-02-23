import { serverBaseUrlFromHeaders } from "@/lib/url/baseUrl";
import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/sign-in");
}

