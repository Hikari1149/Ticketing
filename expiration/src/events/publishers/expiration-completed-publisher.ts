import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from '@hitickets/common';

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationCompleted;
}
