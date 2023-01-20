import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@dashboard/components/ChannelsAvailabilityDropdown";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  SaleDetailsFragment,
  VoucherDetailsFragment,
} from "@dashboard/graphql";
import { productUrl } from "@dashboard/products/urls";
import { Card, TableBody, TableCell, TableFooter } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, ListProps, RelayToFlat } from "../../../types";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface SaleProductsProps extends ListProps, ListActions {
  products:
    | RelayToFlat<SaleDetailsFragment["products"]>
    | RelayToFlat<VoucherDetailsFragment["products"]>;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const DiscountProducts: React.FC<SaleProductsProps> = props => {
  const {
    products,
    disabled,
    onProductAssign,
    onProductUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.discountProductsHeader)}
        toolbar={
          <Button onClick={onProductAssign} data-test-id="assign-products">
            <FormattedMessage {...messages.discountProductsButton} />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col />
          <col className={classes.colName} />
          <col className={classes.colType} />
          <col className={classes.colPublished} />
          <col className={classes.colActions} />
        </colgroup>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={products}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={products?.length > 0 && classes.colNameLabel}>
              <FormattedMessage
                {...messages.discountProductsTableProductHeader}
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage {...messages.discountProductsTableTypeHeader} />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              {...messages.discountProductsTableAvailabilityHeader}
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRowLink>
            <TablePaginationWithContext colSpan={numberOfColumns} />
          </TableRowLink>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRowLink
                  hover={!!product}
                  key={product ? product.id : "skeleton"}
                  href={product && productUrl(product.id)}
                  className={classes.tableRow}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colName}
                    thumbnail={maybe(() => product.thumbnail.url)}
                  >
                    {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                  </TableCellAvatar>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(
                      () => product.productType.name,
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown
                        channels={product?.channelListings}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        disabled={!product || disabled}
                        onClick={event => {
                          event.stopPropagation();
                          onProductUnassign(product.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.discountProductsNotFound} />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
DiscountProducts.displayName = "DiscountProducts";
export default DiscountProducts;
