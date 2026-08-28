const { Tickets, User } = require("../models");

const assignedUserInclude = {
  model: User,
  as: "assignedUser",
  attributes: ["id", "username", "email", "mobile", "createdAt"],
};

const formatTicket = (ticket) => {
  if (!ticket) return null;

  const data = ticket.toJSON();
  data.assigned_to = data.assignedUser;
  delete data.assignedUser;

  return data;
};

const createTicket = async (data) => {
  const ticket = await Tickets.create(data);

  const result = await Tickets.findByPk(ticket.ticket_id, {
    include: [assignedUserInclude],
  });

  return formatTicket(result);
};

const getAllTickets = async () => {
  const tickets = await Tickets.findAll({
    include: [assignedUserInclude],
  });

  return tickets.map(formatTicket);
};

const getTicketById = async (id) => {
  const ticket = await Tickets.findByPk(id, {
    include: [assignedUserInclude],
  });

  return formatTicket(ticket);
};

const updateTicket = async (id, data) => {
  await Tickets.update(data, { where: { ticket_id: id } });

  const ticket = await Tickets.findByPk(id, {
    include: [assignedUserInclude],
  });

  return formatTicket(ticket);
};

const deleteTicket = async (id) => {
  return await Tickets.destroy({
    where: { ticket_id: id },
  });
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
