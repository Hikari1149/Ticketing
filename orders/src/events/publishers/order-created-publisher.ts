import { Publisher, OrderCreatedEvent, Subjects } from '@hitickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
