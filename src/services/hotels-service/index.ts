import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error'

async function consultHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (  
      !ticket 
      || ticket.status === 'RESERVED' 
      || ticket.TicketType.isRemote 
      || !ticket.TicketType.includesHotel
    ) {
    throw paymentRequiredError();
  }
}

async function getHotels(userId: number) {
  await consultHotels(userId);

  const result = await hotelRepository.findHotels();
  return result;
}

async function getHotelsRooms(userId: number, hotelId: number) {
  await consultHotels(userId);
  const result = await hotelRepository.findHotelId(hotelId);

  if (!result) {
    throw notFoundError();
  }
  return result;
}

const hotelService = {
  getHotels,
  getHotelsRooms,
};

export default hotelService;
