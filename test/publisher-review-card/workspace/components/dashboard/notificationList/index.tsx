"use client";

import type { ComponentProps } from "react";
import LegacyNotificationList from "../../NotificationList";

export interface NotificationListProps
  extends ComponentProps<typeof LegacyNotificationList> {}

const NotificationList = (props: NotificationListProps) => (
  <LegacyNotificationList {...props} />
);

export default NotificationList;
