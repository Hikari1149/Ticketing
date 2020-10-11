import { Ticket } from '../ticket';

it(`implements optimistic cocurrency control`, async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concret',
    price: 5,
    userId: '1212312',
  });
  // Save the ticket to the database
  await ticket.save();
  // fetch the ticket twice

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first fetched ticket
  await firstInstance!.save();
  // save the secon fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (e) {
    return;
  }

  throw new Error(`should not reach ths point`);
});

it(`increments the version number on multiple saves`, async () => {
  const ticket = Ticket.build({
    title: 'concret',
    price: 5,
    userId: '1212312',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
