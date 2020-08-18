import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should create a new appointment', async () => {
    const fakeRepo = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeRepo);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1231231231231',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231231231231');
  });

  // it('should not create two appointments on the same time', () => {
  //   expect(1).toBe(1);
  // });
});
