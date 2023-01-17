import { WarehouseSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";

export function getSortQueryField(
  sort: WarehouseListUrlSortField,
): WarehouseSortField {
  switch (sort) {
    case WarehouseListUrlSortField.name:
      return WarehouseSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
