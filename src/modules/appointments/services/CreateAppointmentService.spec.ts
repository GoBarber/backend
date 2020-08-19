import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    const fakeRepo = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeRepo);
  });

  it('should create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1231231231231',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231231231231');
  });

  it('should not create two appointments on the same time', async () => {
    const date = new Date(2020, 12, 31, 23, 59, 59, 99);

    await createAppointment.execute({
      date,
      provider_id: '1231231231231',
    });

    expect(
      createAppointment.execute({
        date,
        provider_id: '1231231231231',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
