import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getApiKeys } from "@/lib/admin-api-keys";
import { ApiKeysClient } from "./api-keys-client";

export default async function ApiKeysPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const keys = await getApiKeys();

  return (
    <ApiKeysClient
      initialKeys={JSON.parse(JSON.stringify(keys))}
    />
  );
}
