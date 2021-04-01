import * as homePage from "../apiRequests/HomePage";

export function getOrdersReadyToFulfill(channelSlug) {
  return homePage
    .getOrdersWithStatus("READY_TO_FULFILL", channelSlug)
    .its("body.data.orders.totalCount");
}
export function getOrdersReadyForCapture(channelSlug) {
  return homePage
    .getOrdersWithStatus("READY_TO_CAPTURE", channelSlug)
    .its("body.data.orders.totalCount");
}
export function getProductsOutOfStock(channelSlug) {
  return homePage
    .getProductsOutOfStock(channelSlug)
    .its("body.data.products.totalCount");
}
export function getSalesAmount(channelSlug) {
  return homePage
    .getSalesForChannel(channelSlug, "TODAY")
    .its("body.data.ordersTotal.gross.amount");
}
export function getTodaysOrders(channelSlug) {
  return homePage
    .getOrdersForChannel(channelSlug, "TODAY")
    .its("body.data.orders.totalCount");
}