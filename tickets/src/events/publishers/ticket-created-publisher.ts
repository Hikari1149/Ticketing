import { Publisher, Subjects, TicketCreatedEvent } from '@hitickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
