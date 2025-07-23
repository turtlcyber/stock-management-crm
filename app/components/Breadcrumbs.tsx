import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type Crumb = {
  label: string;
  href?: string; // last item won't have href
};

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
