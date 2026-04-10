import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getWidgetLayout, WIDGET_TYPES } from "@/lib/admin-widgets";
import { CustomizeClient } from "./customize-client";

export default async function CustomizePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const currentLayout = await getWidgetLayout(session.userId);

  return (
    <CustomizeClient
      currentLayout={currentLayout}
      availableWidgets={WIDGET_TYPES}
    />
  );
}
