import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { availableStatuses } from '@/data/invoices';

export type Status = (typeof availableStatuses)[number]['id'];

const statuses = availableStatuses.map(({ id }) => id) as Array<Status>;

export const statusEnum = pgEnum(
  'status',
  statuses as [Status, ...Array<Status>]
);

export const Invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  createTs: timestamp('createTs').defaultNow().notNull(),
  status: statusEnum('status').notNull(),
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  customerId: integer('customerId')
    .notNull()
    .references(() => Customers.id),
  userId: text('userId').notNull(),
  organizationId: text('organizationId'),
});

export const Customers = pgTable('customers', {
  id: serial('id').primaryKey().notNull(),
  createTs: timestamp('createTs').defaultNow().notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  userId: text('userId').notNull(),
  organizationId: text('organizationId'),
});
