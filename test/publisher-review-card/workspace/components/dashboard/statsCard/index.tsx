"use client";

import type { ComponentProps } from "react";
import LegacyStatsCard from "../../StatsCard";

export interface StatsCardProps extends ComponentProps<typeof LegacyStatsCard> {}

const StatsCard = (props: StatsCardProps) => <LegacyStatsCard {...props} />;

export default StatsCard;
