import { TableCell, TableRow } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TransactionEventFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { TransactionFakeEvent } from "@saleor/orders/types";
import clsx from "clsx";
import React from "react";

import { mapTransactionEvent } from "../../../utils";
import { EventCreatedBy } from "./EventCreatedBy";
import { EventStatus } from "./EventStatus";
import { EventTime } from "./EventTime";
import { EventType } from "./EventType";
import { PspReference } from "./PspReference";

interface EventItemProps {
  event: TransactionEventFragment | TransactionFakeEvent;
  onHover: (pspReference: string) => void;
  hoveredPspReference: string;
  hasCreatedBy: boolean;
}

const useStyles = makeStyles(
  theme => ({
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    row: {
      "&&:hover": {
        backgroundColor: theme.palette.saleor.active[5],
      },
    },
    hover: {
      backgroundColor: theme.palette.saleor.active[5],
    },
    colSmall: {
      [theme.breakpoints.down("md")]: {
        // Take as little space as possible on mobile
        width: "1%",
        whiteSpace: "nowrap",
      },
    },
    colStatus: {
      [theme.breakpoints.up("md")]: {
        // Max text with "Success"
        width: "126px",
      },
    },
    colPspReference: {
      [theme.breakpoints.up("md")]: {
        width: "250px",
      },
    },
    colDate: {
      width: "25%",
    },
    colCreatedBy: {
      width: "20%",
    },
    colLast: {
      // Align with card
      [theme.breakpoints.up("md")]: {
        "&&&": {
          paddingRight: "32px",
          textAlign: "right",
        },
      },
      [theme.breakpoints.down("md")]: {
        whiteSpace: "nowrap",
      },
      "&$colDate": {
        width: "35%",
      },
    },
  }),
  { name: "OrderTransactionEvents-EventItem" },
);

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onHover,
  hoveredPspReference,
  hasCreatedBy,
}) => {
  const classes = useStyles();
  const { type, status } = mapTransactionEvent(event);

  const isHovered = event.pspReference === hoveredPspReference;

  return (
    <TableRow
      onMouseOver={() => onHover(event.pspReference)}
      className={clsx(classes.row, isHovered && classes.hover)}
      data-ishovered={isHovered}
    >
      <TableCell className={clsx(classes.colSmall, classes.colStatus)}>
        <EventStatus status={status} />
      </TableCell>
      <TableCell>
        <Money money={event.amount} />
      </TableCell>
      <TableCell
        className={classes.colSmall}
        colSpan={!event.pspReference && 2}
      >
        <EventType type={type} />
      </TableCell>
      {event.pspReference && (
        <TableCell className={clsx(classes.colSmall, classes.colPspReference)}>
          <PspReference
            reference={event.pspReference}
            url={event.externalUrl}
          />
        </TableCell>
      )}
      <TableCell
        className={clsx(classes.colDate, !hasCreatedBy && classes.colLast)}
      >
        <EventTime date={event.createdAt} />
      </TableCell>
      {hasCreatedBy && (
        <TableCell className={clsx(classes.colCreatedBy, classes.colLast)}>
          <EventCreatedBy createdBy={event.createdBy} />
        </TableCell>
      )}
    </TableRow>
  );
};
