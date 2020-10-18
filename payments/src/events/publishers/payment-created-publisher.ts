import { Subjects, Publisher, PaymentCreatedEvent } from '@hitickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreted;
}
