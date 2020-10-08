import { Subjects, Publisher, OrderCancelledEvent } from '@hitickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
