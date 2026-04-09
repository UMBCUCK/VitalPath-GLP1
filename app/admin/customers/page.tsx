import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminCustomers } from "@/lib/admin-data";
import { AdminCustomersClient } from "./customers-client";

export default async function CustomersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const customers = await getAdminCustomers();
  return <AdminCustomersClient customers={customers} />;
}
