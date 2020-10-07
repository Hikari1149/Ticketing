import { Publisher, Subjects, TicketUpdatedEvent } from '@hitickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
