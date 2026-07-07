import { redirect } from "next/navigation";

// Единый вход теперь на /login. Старый адрес перенаправляем.
export default function AdminLoginRedirect() {
  redirect("/login?next=/admin");
}
